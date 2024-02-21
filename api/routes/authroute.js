const express=require("express")
const { registerUserctrl, loginUserctrl, getAllUserctrl, getUserctrl, deleteUserctrl, updateUserctrl, blockUserctrl, unblockUserctrl, handleRefreshToken, logoutUserctrl, updatePasswordctrl, forgotPasswordToken } = require("../controllers/usercontroller")
const { authMiddleware, isAdmin } = require("../middlewares/authmiddleware")
const router=express.Router()

//! register user route
router.post("/register",registerUserctrl)

//! login user route
router.post("/login",loginUserctrl)

//! update password route
router.put("/updatepassword",authMiddleware,updatePasswordctrl)

//! forget password token route
router.post("/forgotpasswordtoken",forgotPasswordToken)

//! get all users route
router.get("/allusers",authMiddleware,isAdmin,getAllUserctrl)

//! refresh token
router.get("/refresh",handleRefreshToken)

//! logout user route
router.get("/logout",logoutUserctrl)

//! get single user route
router.get("/:id",authMiddleware,isAdmin,getUserctrl)

//! delete user route
router.delete("/deleteuser/:id",deleteUserctrl)

//! update user route
router.put("/updateuser",authMiddleware,updateUserctrl)

//! block user route
router.put("/blockuser/:id",authMiddleware,isAdmin,blockUserctrl)

//! unblock user route
router.put("/unblockuser/:id",authMiddleware,isAdmin,unblockUserctrl)


module.exports=router