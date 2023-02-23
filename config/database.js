const mongoose = require("mongoose")
const {MONGODB_URL} =process.env

exports.connect=()=>{
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(console.log("connected with database"))
    .catch((error)=>{
        console.log("error in connection")
        console.log(error)
        process.exit(1)
    })
    
}