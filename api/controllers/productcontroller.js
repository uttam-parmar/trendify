const Product = require("../models/productmodel");
const asyncHandler=require("express-async-handler")
const validateMongodbId = require("../utils/validatemongodbid")
const slugify=require("slugify")

//! create product

const createProductctrl=asyncHandler(async (req,res,next)=>{
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct=await Product.create(req.body)
        res.json({message:"product created successfully",product:newProduct})
    } catch (error) {
        throw new Error(error)
    }
})

//! get single product

const getProductctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const findProduct=await Product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//! get all products

const getAllProducts=asyncHandler(async (req,res,next)=>{
    try {
        //# filtering
        const queryObj={...req.query}
        const excludeFields=["page","sort","limit","fields"]
        excludeFields.forEach((element)=> delete queryObj[element])
        console.log(queryObj,req.query)

        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=> `$${match}`)
        let query=Product.find(JSON.parse(queryStr))

        //#sorting
        if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ")
            query=query.sort(sortBy)
        }
        else{
            query=query.sort("-createdAt")
        }

        //# limiting fields
        if(req.query.fields){
            const fieldsBy=req.query.fields.split(",").join(" ")
            query=query.select(fieldsBy)
        }
        else{
            query=query.select("-__v")
        }

        //# pagination
        const page=req.query.page
        const limit=req.query.limit
        const skip=(page-1)*limit
        query=query.skip(skip).limit(limit)
        if(req.query.page){
            const productcount=await Product.countDocuments()
            if(skip >= productcount) throw new Error("this page does not exists")
        }

        const Products=await query
        res.json(Products)
    } catch (error) {
        throw new Error(error)
    }
})

//! update product

const updateProductctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const updateProduct=await Product.findOneAndUpdate({_id:id},req.body,{new:true})
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//! delete product

const deleteProductctrl=asyncHandler(async (req,res,next)=>{
    const {id}=req.params
    validateMongodbId(id)
    try {
        const deleteProduct=await Product.findOneAndDelete({_id:id})
        res.json({message:"product deleted successfully"})
    } catch (error) {
        throw new Error(error)
    }
})


module.exports={createProductctrl, getProductctrl, getAllProducts, updateProductctrl, deleteProductctrl}