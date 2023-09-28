const { errorHandler } = require('../middleWare/errorMiddleWare')
const UserModal = require('../model/userModal')
require('dotenv').config()

//razorpay
const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


const getReturnmanagement = async (req, res, next) => {
  try {
    const returnReq = await UserModal.aggregate([{ $match: { "orders.status": 'returnInProgress' } }, { $unwind: "$orders" }, { $match: { 'orders.status': 'returnInProgress' } }, { $project: { orders: true, firstName: true, lastName: true } }])
    console.log("returnReq", returnReq);
    res.render('./admin/returnManagement/returnManagement', { returnReq })
  } catch (error) {
    errorHandler(error, req, res, next)

  }
}
const postReturnRazorPay = async(req,res,next)=>{
  try {
    
      console.log('inside postRazorPayCreateOrder');
      console.log('req.body.balaceToPay ', req.body.balaceToPay );

      const amount = req.body.balaceToPay * 100
      const options = {
          amount: amount,
          currency: 'INR',
          receipt: 'razorUser@gmail.com'
      }

      razorpayInstance.orders.create(options,
          (err, order) => {
              if (!err) {
                  res.status(200).send({
                      success: true,
                      msg: 'Order Created',
                      order_id: order.id,
                      amount: amount,
                      key_id: RAZORPAY_ID_KEY,
                      // product_name: req.body.name,
                      // description: req.body.description,
                      contact: "8567345632",
                      name: "Sandeep Sharma",
                      email: "sandeep@gmail.com"
                  });
              }
              else {
                  res.status(400).send({ success: false, msg: 'Something went wrong!' });
              }
          }
      );

  
  } catch (error) {
    errorHandler(error,req,res,next)
  }
}
const postConfirmReturn = async (req, res, next) => {
  try {
    console.log("req.body.orderData", req.body.orderData);
    const { userId, orderId, modeOfRefund, amount } = req.body.orderData;

    // Use updateOne to update the order status
    if(modeOfRefund === 'addToWallet'){

    
      const result = await UserModal.updateOne(
        {
          _id: userId,
          "orders._id": orderId
        },
        {
          $set: { "orders.$.status": 'returned' },
          $push: {
            "wallet.transaction": {
              $each: [{ typeOfTransaction: "credit", amount: amount }],
              $position: 0 // Insert at the beginning
            }
          },
          $inc: { "wallet.balance": amount }
        }
      );
  
      console.log("Update Result:", result);
  
      if (result.nModified === 0) {
        // Handle the case where no matching document was modified (no user or order found)
        return res.status(404).json({ success: false, message: "User or order not found" });
      }
  
      res.json({ success: true });
    }else{
    const result = await UserModal.updateOne(
      {
        _id: userId,
        "orders._id": orderId
      },
      {
        $set: { "orders.$.status": 'returned', }
      }
    );

    console.log("Update Result:", result);

    if (result.nModified === 0) {
      // Handle the case where no matching document was modified (no user or order found)
      return res.status(404).json({ success: false, message: "User or order not found" });
    }

    res.json({ success: true });
  }
  } catch (error) {
    console.error("Error:", error);
    errorHandler(error, req, res, next);
  }
}



module.exports = {
  getReturnmanagement,
  postReturnRazorPay,
  postConfirmReturn,

}