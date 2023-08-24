const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Brand = mongoose.Schema({
    brandName:{
        type:String,
        required:true
    },
    product:[{
        _id:ObjectId,
        productName:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        unitPrice:{
            type:String,
            required:true
        },
        // gallery:[],
        discription:{
            type:String,
            required:true
        },
        specification:{
            frontCamera:{
                type:String,
                required:true
            },
            backCamera:{
                type:String,
                required:true
            },
            ram:{
                type:String,
                required:true
            },
            internalStorage:{
                type:String,
                required:true
            },
            battery:{
                type:String,
                required:true
            },
            processor:{
                type:String,
                required:true
            },
            chargerType:{
                type:String,
                required:true
            },
        }
    }]
})

module.exports = new mongoose.model('brand',Brand)