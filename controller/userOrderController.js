const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const { errorHandler } = require('../middleWare/errorMiddleWare')


const getOrders = async (req, res, next) => {
  try {
      let brands = await BrandModal.distinct('brandName')
      const user = await UserModal.findOne({ _id: req.session.userId })
      const orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: true })
      res.render('users/order', { orders, brands, user });
  } catch (error) {
      errorHandler(error, req, res, next)
  }
};
const getOrderSinglePage = async (req, res, next) => {
  try {
      let brands = await BrandModal.distinct('brandName');
      const user = await UserModal.findOne({ _id: req.session.userId });
      let orderId = req.query.Id;
      let orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: 1 }).lean();
      let order = orders.orders.find((order) => order._id.toString() === orderId.toString());
      let completeData = await Promise.all(order.product.map(async (products) => {
          try {
              const product = await ProductModal.findOne({ _id: products.productId }).lean();
              if (product) {
                  // Populate the 'gallery' and 'specification' fields
                  const populatedProduct = await ProductModal.populate(product, {
                      path: 'gallery', // Assuming 'gallery' is an array of strings
                      select: 'specification' // Specify the fields to populate
                  });
                  // Merge the populated fields into the original product
                  const mergedProduct = { ...product, ...populatedProduct };
                  // Merge with the product-specific order data
                  return { ...mergedProduct, ...products };
              }
          } catch (error) {
              console.log(error.message);
          }
      }));
      completeData.forEach((item, index) => {
          item.status = order.status; // Assuming 'status' is the correct field name
      });
      const addressToShip = user.shippingAddress.find((shippingAddress) => shippingAddress._id.toString() === order.addressToShip.toString())
      res.render('users/orderSinglePage', { order: completeData, addressToShip, brands, user, orderId });
      console.log("completeData",completeData)
  } catch (error) {
      errorHandler(error, req, res, next);
  }
}
const postCancellOrder = async (req, res, next) => {
  try {
      const userId = req.session.userId;
      const { orderId, cancelMessage, modeOfRefund } = req.body.newFormData;
      const updatedUser = await UserModal.updateOne(
          {
              _id: userId,
              'orders._id': orderId // Find the user by ID and match the order with the specified orderId
          },
          {
              $set: {
                  'orders.$.status': 'cancelledByClient', // Update the status of the matched order
                  'orders.$.cancelMessage': cancelMessage,
                  'orders.$.modeOfRefund': modeOfRefund
              }
          }
      );
      if (updatedUser.nModified === 1) {
          // Check if an order was actually updated
          res.status(200).json({ success: true });
      } else {
          res.status(400).json({ success: false, message: 'Order not found or could not be cancelled' });
      }
  } catch (error) {
      errorHandler(error, req, res, next);
  }
};
const postOrderReturnRequest = async (req, res, next) => {
  try {
      const userId = req.session.userId;
      const { orderId, returnMessage, modeOfRefund } = req.body.newFormData
      await UserModal.updateOne(
          {
              _id: userId,
              'orders._id': orderId // Find the user by ID and match the order with the specified orderId
          },
          {
              $set: {
                  'orders.$.status': 'returnInProgress', // Update the status of the matched order
                  'orders.$.returnMessage': returnMessage,
                  'orders.$.modeOfRefund': modeOfRefund
              }
          }
      );
      res.status(200).json({ success: true });
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}

module.exports = {
  getOrders,
    getOrderSinglePage,
    postCancellOrder,
    postOrderReturnRequest,
}