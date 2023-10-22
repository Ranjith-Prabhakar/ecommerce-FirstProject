const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const { errorHandler } = require('../middleWare/errorMiddleWare')

const getCart = async (req, res, next) => {
  try {
      let brands = await BrandModal.distinct('brandName')
      const user = await UserModal.findOne({ _id: req.session.userId });
      const cartItems = user.cart; // Get the cart items array
      let cartValue = 0
      // Create an array to hold cart items with product data and quantity
      const cartProductPromises = cartItems.map(async (cartItem) => {
          const product = await ProductModal.findOne({ _id: cartItem.productId });
          product.cartQuantity = cartItem.quantity; // Set the quantity property of the product
          cartValue += parseFloat(product.unitPrice * product.cartQuantity)
          return product;
      });
      // Use Promise.all to wait for all product data to be fetched
      const cartProducts = await Promise.all(cartProductPromises);
      res.render('users/cart', { cartProducts, cartValue, user, brands }); // Pass cartProducts to the EJS template
  } catch (error) {
      errorHandler(error, req, res, next);
  }
};
const postAddToCart = async (req, res, next) => {
  try {
      let count = req.body.count ? req.body.count : 1
      let result = await UserModal.updateOne({ _id: req.body.userId, "cart": { $not: { $elemMatch: { productId: req.body.productId } } } },
          { $addToSet: { cart: { productId: req.body.productId, quantity: count } } })
      if (result.modifiedCount === 1) {
          res.json({ success: true })
      } else if (result.modifiedCount === 0) {
          res.json({ success: false })
      }
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}
const postUpdateCartProductQty = async (req, res, next) => {
  try {
      const userId = req.session.userId;
      const productId = req.body.productId;
      const quantity = req.body.quantity;
      const result = await UserModal.updateOne(
          { _id: userId, 'cart.productId': productId },
          { $set: { 'cart.$.quantity': quantity } }
      );
      if (result.modifiedCount === 1) {
          res.json({ success: true });
      } else {
          res.json({ success: false, message: 'Product quantity not updated.' });
      }
  } catch (error) {
      errorHandler(error, req, res, next);
  }
};
const postRemoveFromCart = async (req, res, next) => {
  try {
      const result = await UserModal.updateOne({ _id: req.session.userId, cart: { $elemMatch: { productId: req.body.productId } } }, { $pull: { cart: { productId: req.body.productId } } });
      if (result.modifiedCount === 1) {
          res.json({ success: true })
      } else if (result.modifiedCount === 0) {
          res.json({ success: false })
      }
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}

module.exports = {
  getCart,
  postAddToCart,
  postUpdateCartProductQty,
  postRemoveFromCart,
}