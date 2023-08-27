const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Brand = mongoose.Schema({
    brandName:{
        type:String,
        required:true
    },
})

module.exports = new mongoose.model('brand',Brand)