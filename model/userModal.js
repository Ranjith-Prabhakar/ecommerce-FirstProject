const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'too small'],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
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
    // userName: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    password: {
        type: String,
        required: true,

    },

    shippingAddress: [{

        name: {
            type: String,
        },
        country: {
            type: String,
            // required: true
        },
        state: {
            type: String,
            // required: true
        },
        district: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            // required: true
        },
        pincode: {
            type: String,
            // required: true
        },
        street: {
            type: String,
            // required: true
        },
        houseName: {
            type: String,
            // required: true
        },
        buildingNo: {
            type: String,
            // required: true
        },
        // landMark: {
        //     type: String,
        // },
    }],
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },

    status: {
        type: Boolean,
        required: true,
        default: true
    },
    cart: [{
        productId: ObjectId,
        quantity: {
            type: Number,
            default: 0
        }
    }],
    wishList: [{
        productId: ObjectId,
    }],
    orders: [{
        orderDate: {
            type: Date,
            default: () => new Date().toISOString()
        },

        product: [{
            productId: ObjectId,
            orderQuantity: String,
            price: String,
            rating:Number,
            review:String,
        }],
        grossTotal: String,
        netTotal:String,
        balanceToSettle:{
            balance:Number,
            settledMode:{
                type:String,
                enum:['byCash',"upi"]
            }
        },
        modeOfPayment: String,
        status: {
            type: String,
            enum: ['placed', 'cancelledByAdmin', 'cancelledByClient', 'packed', 'inTransit', "delivered", "returnInProgress", "returned"],
            default: 'placed'
        },
       
        addressToShip: ObjectId,
        razorpay_payment_id: String,
        razorpay_order_id: String,
        couponId: ObjectId,
        couponValue:Number,
        walletDebit:Number,
        returnMessage: String,
        cancelMessage: String,
        modeOfRefund: String
    }],
    wallet: {
            balance:{type: Number,default:0},
            transaction: [{
                typeOfTransaction: {
                    type: String,
                    enum: ['debit', "credit"]
                },
                amount: Number,
            }]

        }

})

module.exports = mongoose.model('digiUser', User)


