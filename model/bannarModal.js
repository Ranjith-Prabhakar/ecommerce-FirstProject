const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Banner = mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    unitPrice: {
        type: String,
        required: true
    },
    launchDate: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    }
})

module.exports = new mongoose.model('banner', Banner)