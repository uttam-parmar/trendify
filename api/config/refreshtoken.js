const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config()

//! generate refresh token
const generateRefreshToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"})
}

module.exports={generateRefreshToken}