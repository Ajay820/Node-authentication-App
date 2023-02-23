
const app = require("./app.js")

const {PORT} = process.env


app.listen(PORT,()=>{
    console.log(`port is running at ${PORT}`)
})