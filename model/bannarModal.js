const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
   
       
            brandName: {
                type: String,
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            description: { // Corrected field name
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
    

});

module.exports = mongoose.model('Banner', bannerSchema); // Corrected model name
