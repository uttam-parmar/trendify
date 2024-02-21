const mongoose=require("mongoose")
const asyncHandler=require("express-async-handler")

const connectdb=()=>{
    try {
        mongoose.connect("mongodb://localhost:27017/trendify")
        console.log("mongodb connected successfully")
    } catch (error) {
        throw new Error(error)
    }
}

module.exports=connectdb