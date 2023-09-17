const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const CouponSchema = mongoose.Schema({
  generatedDate: {
    type: Date,
    default: () => new Date().toISOString()
  },
  expiryDate: {
    type: Date,
    default: function () {
      // Calculate the expiry date by adding the specified number of days to the generated date
      const generatedDate = new Date(this.generatedDate);
      generatedDate.setDate(generatedDate.getDate() + this.expiryDays);
      return generatedDate.toISOString();
    }
  },
  active: {
    type: Boolean,
    default: true // Initially set to true, becomes false when coupon expires
  },
  expiryDays: {
    type: Number,
    required: true // You must provide the number of days for expiration
  },
 
  couponCode: String,
  couponValue: Number,
  criteria: {
    type: String,
    enum: ['brand', 'product', 'price', 'date','customer']
  },
  brand:String,
  product:String,
  amountRange: Number,
  dateBelow:Date,
  noOfSuccessTransaction:Number,
 
},{
  timestamps: true // Add timestamps option
});

const CouponModel = mongoose.model('Coupon', CouponSchema);

module.exports = CouponModel;
