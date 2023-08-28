const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Brand = mongoose.Schema({
    brandName:{
        type:String,
        required:true
    },
    noOfModels:{
        type:Number,
        required:true,
        default:0
    }
})

module.exports = new mongoose.model('brand',Brand)