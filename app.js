require("dotenv").config()
require("./config/database").connect()
const express = require("express")

const app = express()

const User = require("./model/user.js")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const auth = require("./middleware/auth")

const cookieparser = require("cookie-parser")


app.use(express.json())  // this is accespting json input data
app.use(express.urlencoded({extended:true}))  // this is for accepting the form data
app.use(cookieparser())  // this is to enable the cookie parser

app.get("/",(req,res)=>{
    res.send("successfully started Auth app")
})

app.post("/register",async(req,res)=>{
    try{
        const {firstname,lastname,email,password} = req.body

        if(!(email && password && firstname && lastname)){
            res.status(200).send("All fields are required")
        }

        const Uemail = await User.findOne({email})

        if((Uemail)){
            res.status(400).send("User Already Exists")
        }

        const Encryptedp = await bcrypt.hash(password,10)

        const user =await User.create({
            firstname,
            lastname,
            email,
            password: Encryptedp
        })

        const token = jwt.sign({id:user._id},"ssh",{expiresIn:"2h"})

        user.token = token
        user.password = undefined,


        res.status(200).json({
            user,
            token
        })    
    
    }
    catch(error){
        console.log("error in signup")
        console.log(error)
    }
})


app.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body

    const user =  await User.findOne({email})

    if(!user){
        res.status(200).send("Register First")
    }

    if(!(await bcrypt.compare(password,user.password))){
        res.status(400).send("please check the password and try once again")
    }

    if(user && (await bcrypt.compare(password,user.password))){

        const token = jwt.sign({id:user._id},"ssh",{expiresIn:"2h"})

        options = {
            expires: new Date(Date.now()+3 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }
        res.status(200).cookie("token",token,options)

        res.status(200).json({user})
    }
    }
    catch(error){
        console.log(error)
        console.log("error in login")
    }
})

app.get("/dashboard",auth,async (req,res)=>{
    // res.status(200).json("welcome to dashboard")


    const user = await User.findById(req.user.id)

res.status(200).json({
    user: user.firstname
})
})

app.get("/logout",(req,res)=>{
    res.status(200).cookie("token","",{
        expires: new Date(Date.now())
    })
    res.status(200).send("successfully logged out")
})

module.exports = app
