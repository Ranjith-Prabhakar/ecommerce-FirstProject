const mongoose = require('mongoose')
const validator = require('validator')

const Admin = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'too small'],
    },
    lastName: {
        type: String,
        required: true,
    },
    profImage: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('invalid email')
            }
        }

    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(number) {
            if (number.toString().length !== 10) {
                throw new Error('invalind mobile number')
            }
        }
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
      },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
})

module.exports = mongoose.model('digiAdmin', Admin)