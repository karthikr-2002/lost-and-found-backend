const mongoose = require("mongoose")
const foundSchema=mongoose.Schema(
    {
       
            category: String,
            description: String,
            place: String,
            email: String,
            phone: String,
            image: String


    }
)

const foundModel=mongoose.model("lostandfounds",foundSchema)  
module.exports=foundModel