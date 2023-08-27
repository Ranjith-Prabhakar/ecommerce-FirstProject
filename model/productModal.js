const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Product = mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unitPrice: {
        type: String,
        required: true
    },
    gallery:{
        type:Array,
        required:true
    },
    discription: {
        type: String,
        required: true
    },
    specification: {
        frontCamera: {
            type: String,
            required: true
        },
        backCamera: {
            type: String,
            required: true
        },
        ram: {
            type: String,
            required: true
        },
        internalStorage: {
            type: String,
            required: true
        },
        battery: {
            type: String,
            required: true
        },
        processor: {
            type: String,
            required: true
        },
        chargerType: {
            type: String,
            required: true
        },
    }

})

module.exports = new mongoose.model('product', Product)