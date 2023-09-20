const { errorHandler } = require('../middleWare/errorMiddleWare')
const UserModal = require('../model/userModal')

const getReturnmanagement = async (req, res, next) => {
  try {
    const returnReq = await UserModal.aggregate([{ $match: { "orders.status": 'returnInProgress' } }, { $unwind: "$orders" }, { $match: { 'orders.status': 'returnInProgress' } }, { $project: { orders: true, firstName: true, lastName: true } }])
    console.log("returnReq", returnReq);
    res.render('./admin/returnManagement/returnManagement', { returnReq })
  } catch (error) {
    errorHandler(error, req, res, next)

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
  postConfirmReturn,

}