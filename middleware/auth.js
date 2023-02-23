const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        res.status(200).send("tokn is missing")
    }

    try{
        const decode = jwt.verify(token,"ssh")

        req.user = decode;
    }
    catch(error){
        res.status(400).send("token is invalid")
    }

    return next()
}

module.exports = auth