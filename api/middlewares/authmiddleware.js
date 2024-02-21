const User=require("../models/usermodel")
const asyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")

const authMiddleware=asyncHandler(async (req,res,next)=>{
    let token
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
        try {
            if(token){
                const verifyToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
                const user=await User.findById(verifyToken?.id)
                req.user=user
                next()
            }
        } catch (error) {
            throw new Error("no authorized token,please login again")
        }
    }
    else{
        throw new Error("there is no token attached with header")
    }
})

const isAdmin=asyncHandler(async (req,res,next)=>{
    const {email}=req.user
    const adminUser=await User.findOne({email})
    if(adminUser.role !== "admin"){
        throw new Error("you are not admin")
    }
    else{
        next()
    }
})

module.exports={authMiddleware,isAdmin}