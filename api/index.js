const express=require("express")
const app=express()
const dotenv=require("dotenv")
const connectdb = require("./config/connectdatabase")
dotenv.config()
const port=process.env.PORT || 3000
const bodyparser=require("body-parser")
const authrouter=require("./routes/authroute")
const productroute=require("./routes/productroute")
const { notFound, errorHandler } = require("./middlewares/errorhandler")
const cookieparser=require("cookie-parser")
const morgan=require("morgan")

connectdb()
app.use(morgan("dev"))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(cookieparser())

app.use("/api/user",authrouter)
app.use("/api/product",productroute)

// error handlers
app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{
    console.log("server running")
})