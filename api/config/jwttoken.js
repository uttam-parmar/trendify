const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config()

//! generate jwt token
const generatejwttoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
}

module.exports={generatejwttoken}