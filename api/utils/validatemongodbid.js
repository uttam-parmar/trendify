const mongoose=require("mongoose")

const validateMongodbId=(id)=>{
    const validate= mongoose.Types.ObjectId.isValid(id)
    if(!validate){
        throw new Error("id not found or wrong id,enter valid id")
    }
}

module.exports=validateMongodbId