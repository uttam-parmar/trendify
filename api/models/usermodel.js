const mongoose = require('mongoose');
const bcrypt=require("bcryptjs")
const crypto=require("crypto")

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:Array,
        default:[]
    },
    address:[{type:mongoose.Schema.Types.ObjectId,ref:"Address"}],
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}],
    refreshToken:{
        type:String
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    }
},{timestamps:true});

//! hash password using bcrypt

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = await bcrypt.hashSync(this.password, salt);
    this.password=hashedpassword
    next()
})

//! compare password using bcrypt

userSchema.methods.isPasswordMatched=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}

//! create password reset token
userSchema.methods.createPasswordResetToken=async function(){
    const resettoken=crypto.randomBytes(32).toString("hex")
    this.passwordResetToken=crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex")
    this.passwordResetExpires=Date.now()+30*60*1000
    return resettoken
}

//Export the model
module.exports = mongoose.model('User', userSchema);