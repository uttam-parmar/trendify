const express=require("express")
const { createProductctrl, getProductctrl, getAllProducts, updateProductctrl, deleteProductctrl } = require("../controllers/productcontroller")
const { authMiddleware, isAdmin } = require("../middlewares/authmiddleware")
const router=express.Router()

//! create product route
router.post("/",authMiddleware,isAdmin,createProductctrl)

//! get single product route
router.get("/:id",getProductctrl)

//! get all products route
router.get("/",getAllProducts)

//! update product route
router.put("/:id",authMiddleware,isAdmin,updateProductctrl)

//! delete product route
router.delete("/:id",authMiddleware,isAdmin,deleteProductctrl)


module.exports=router