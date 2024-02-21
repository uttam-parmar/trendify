const asyncHandler=require("express-async-handler")
const User = require("../models/usermodel")
const { generatejwttoken } = require("../config/jwttoken")
const { generateRefreshToken } = require("../config/refreshtoken")
const validateMongodbId = require("../utils/validatemongodbid")
const jwt=require("jsonwebtoken")
const { sendEmail } = require("./emailcontroller")


//! register user 

const registerUserctrl=asyncHandler(async (req,res,next)=>{
    const email=req.body.email
        const findUser=await User.findOne({email:email})
        if(!findUser){
            const newUser=await User.create(req.body)
            const {password,...other}=newUser._doc
            res.json(other)
        }
        else{
            throw new Error("user already exists")
        }
})

//! login user

const loginUserctrl=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body
    const findUser=await User.findOne({email:email})
    if(findUser && await(findUser.isPasswordMatched(password))){
        const refreshToken=await generateRefreshToken(findUser?._id)
        const updateUser=await User.findByIdAndUpdate(findUser._id,{
            refreshToken:refreshToken
        },{new:true})
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
        const {password,...other}=updateUser._doc
        res.json({message:"user login successfully",user:other,token:generatejwttoken(findUser?._id)})
    }
    else{
        throw new Error("invalid username or password")
    }
})

//! handle refresh token

const handleRefreshToken = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in cookie");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error("no refresh token found or no matched")
    jwt.verify(refreshToken,process.env.JWT_SECRET_KEY,(err,decoded)=>{
      if(err || user.id !== decoded.id){
        throw new Error("something wrong with refresh token")
      }
      const accesstoken=generatejwttoken(user?._id)
      res.json({accesstoken})
    })
    
});



//! get all user

const getAllUserctrl=asyncHandler(async (req,res,next)=>{
    try {
        const allUsers=await User.find()
        const usersWithoutPassword=allUsers.map(user=>{
            const {password,...other}=user.toObject()
            return other
        })
        res.json(usersWithoutPassword)
    } catch (error) {
        throw new Error(error)
    }
})

//!get single user

const getUserctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const findUser=await User.findById(id)
        const {password,...other}=findUser._doc
        res.json(other)
    } catch (error) {
        throw new Error(error)
    }
})

//! update user

const updateUserctrl = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id)
    try {
        const findUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, { new: true });
        const { password, ...other } = findUser._doc;
        res.json(other);
    } catch (error) {
        throw new Error(error);
    }
});


//! delete user

const deleteUserctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const findUser=await User.findByIdAndDelete(id)
        if(!findUser){
            res.json({message:"user not found"})
        }
        res.json({message:"user deleted successfully"})
    } catch (error) {
        throw new Error(error)
    }
})

//! block user

const blockUserctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const blockUser=await User.findByIdAndUpdate(id,{
            isBlocked:true
        },{new:true})
        res.json({message:"user blocked successfully",user:blockUser})
    } catch (error) {
        throw new Error(error)
    }
})

//! unblock user

const unblockUserctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const unblockUser=await User.findByIdAndUpdate(id,{
            isBlocked:false
        },{new:true})
        res.json({message:"user unblocked successfully",user:unblockUser})
    } catch (error) {
        throw new Error(error)
    }
})

//! logout user

const logoutUserctrl=asyncHandler(async (req,res,next)=>{
    const cookie=req.cookies
    if(!cookie?.refreshToken) throw new Error("no refresh token no need to logout")
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:""
    })
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204)
})

//! update password

const updatePasswordctrl=asyncHandler(async (req,res,next)=>{
    const {_id}=req.user
    const password=req.body.password
    validateMongodbId(_id)
    const user=await User.findById(_id)
    if(password){
        user.password=password
        const updatedPassword=await user.save()
        res.json(updatedPassword)
    }
    else{
        res.json(user)
    }

})

//! forgot password token

const forgotPasswordToken=asyncHandler(async (req,res,next)=>{
    const {email}=req.body
    const user=await User.findOne({email:email})
    if(!user) throw new Error("user not found")
    try {
        const token=await user.createPasswordResetToken()
        await user.save()
        const resetURL= `hii,follow this link to reset password link is valid for 30 min <a href="http://localhost:3000/api/user/resetpassword/${token}">Click here</a>`
        const data={
            to:email,
            text:"hey user",
            subject: "forgot password link",
            htm:resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        
    }
})

module.exports={registerUserctrl, loginUserctrl, getAllUserctrl, getUserctrl, deleteUserctrl, updateUserctrl, blockUserctrl, unblockUserctrl, handleRefreshToken, logoutUserctrl, updatePasswordctrl, forgotPasswordToken}