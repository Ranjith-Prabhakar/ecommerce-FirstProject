const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const CouponModal = require('../model/couponModal')
const { errorHandler } = require('../middleWare/errorMiddleWare')
require('dotenv').config()
//razorpay
const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const getCheckOutPage = async (req, res, next) => {
  try {
      if (req.query.productId) {//singleProduct
          let singleProduct = await ProductModal.findOne({ _id: req.query.productId });
          let coupons = {}
          const productCoupon = await CouponModal.find({ active: true, criteria: 'product' })
          if (productCoupon) {
              let productValidation = productCoupon.find(productCoupon => productCoupon.product === singleProduct.productName)
              if (productValidation) {
                  coupons.productCoupon = productValidation
              } else {
                  const brandCoupon = await CouponModal.find({ active: true, criteria: 'brand' })
                  let brandValidation = brandCoupon.find(brandCoupon => brandCoupon.brand === singleProduct.brandName)
                  if (brandValidation) {
                      coupons.brandCoupon = brandValidation
                  }
              }
          } else {
              const brandCoupon = await CouponModal.find({ active: true, criteria: 'brand' })
              let brandValidation = brandCoupon.find(brandCoupon => brandCoupon.brand === singleProduct.brandName)
              if (brandValidation) {
                  coupons.brandCoupon = brandValidation
              }
          }
          let user = await UserModal.findOne({ _id: req.session.userId })
          let brands = await BrandModal.distinct('brandName')
          res.render('users/checkOutPage', { singleProduct, user, brands, coupons });
          req.query.productId = '';
      } else if (req.session.selectedProducts && req.session.selectedProducts.length) {//selected cart
          let coupons = {}
          let user = await UserModal.findOne({ _id: req.session.userId })
          let brands = await BrandModal.distinct('brandName')
          let productIds = req.session.selectedProducts.map((product) => product.productId);
          let matchingProducts = await ProductModal.find({ _id: { $in: productIds } });
          let productList = matchingProducts.map((product) => {
              let selectedProduct = req.session.selectedProducts.find((selected) => selected.productId === product._id.toString());
              if (selectedProduct) {
                  return {
                      ...product.toObject(),
                      orderQuantity: selectedProduct.productQuantity,
                  };
              } else {
                  return product.toObject();
              }
          });
          req.session.selectedProducts.length = 0;
          req.session.productList = productList
          const priceCoupon = await CouponModal.find({ active: true, criteria: 'price' })
          let total = productList.reduce((sum, productListElement) => {
              let orderQuantity = productListElement.orderQuantity;
              let unitPrice = productListElement.unitPrice;
              // Check if orderQuantity and unitPrice are defined and not empty
              if (orderQuantity && unitPrice) {
                  orderQuantity = parseFloat(orderQuantity.trim());
                  unitPrice = parseFloat(unitPrice.trim());
                  // Check if the parsing was successful and both values are numbers
                  if (!isNaN(orderQuantity) && !isNaN(unitPrice)) {
                      return sum + (orderQuantity * unitPrice);
                  }
              }
              // If any check fails, return the current sum without adding anything
              return sum;
          }, 0);
          let matchingPriceCoupons = priceCoupon.filter((priceCoupon) => {
              return priceCoupon.amountRange < total
          })
          coupons.priceCoupons = matchingPriceCoupons
          res.render('users/checkOutPage', { productList, user, brands, coupons });
      } else if (req.query.cart) {//cart
          let coupons = {}
          const user = await UserModal.findOne({ _id: req.session.userId });
          let brands = await BrandModal.distinct('brandName')
          const cart = user.cart;
          const productIds = cart.map((item) => item.productId);
          const matchingProducts = await ProductModal.find({ _id: { $in: productIds }, quantity: { $gt: 0 } });
          let productList = matchingProducts.map((product) => {
              cart.forEach((cart) => {
                  if (cart.productId.equals(product._id)) {
                      product.orderQuantity = cart.quantity
                  }
              })
              return product
          })
          req.query.cart = false;
          req.session.productList = productList
          const priceCoupon = await CouponModal.find({ active: true, criteria: 'price' })
          // let sessionProductList = req.session.productList //because
          let total = productList.reduce((sum, productListElement) => {
              let orderQuantity = productListElement.orderQuantity;
              let unitPrice = productListElement.unitPrice;
              // Check if orderQuantity and unitPrice are defined and not empty
              if (orderQuantity && unitPrice) {
                  orderQuantity = orderQuantity;
                  unitPrice = unitPrice;
                  // Check if the parsing was successful and both values are numbers
                  if (!isNaN(orderQuantity) && !isNaN(unitPrice)) {
                      return sum + (orderQuantity * unitPrice);
                  }
              }
              // If any check fails, return the current sum without adding anything
              return sum;
          }, 0);
          let matchingPriceCoupons = priceCoupon.filter((priceCoupon) => {
              return priceCoupon.amountRange < total
          })
          let matchingPriceCouponsFiltered = matchingPriceCoupons.reduce((max, obj) => {
              return obj.amountRange > max.amountRange ? obj : max
          }, priceCoupon[0])
          coupons.priceCoupons = matchingPriceCoupons
          res.render('users/checkOutPage', { productList, user, brands, coupons });
      }
  } catch (error) {
      errorHandler(error, req, res, next);
  }
};
const postBuySelectedProducts = (req, res, next) => {
  try {
      req.session.selectedProducts = req.body.selectedProducts
      res.json({ success: true })
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}
//////
const postOrderPlacement = async (req, res, next) => {
  try {
      if (req.body.newFormData) {
          if (req.body.newFormData.razorpay_payment_id && req.body.newFormData.razorpay_order_id) {
              if (req.body.newFormData.couponId) {
                  if (req.body.newFormData.walletDebit) {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                      razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                      razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                      couponId: req.body.newFormData.couponId,
                                      couponValue: req.body.newFormData.couponValue,
                                      walletDebit: req.body.newFormData.walletDebit,
                                      balanceToSettle: {
                                          balance: 0,
                                          settledMode: 'upi'
                                      }
                                  }], $position: 0
                              }
                          }

                      })
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $inc: {
                              "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                          },
                          $push: {
                              "wallet.transaction": {
                                  $each: [
                                      {
                                          typeOfTransaction: 'debit',
                                          amount: parseFloat(req.body.newFormData.walletDebit)
                                      }
                                  ], $position: 0

                              }
                          }
                      })
                  } else {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment,
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                      razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                      razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                      couponId: req.body.newFormData.couponId,
                                      couponValue: req.body.newFormData.couponValue,
                                      balanceToSettle: {
                                          balance: 0,
                                          settledMode: 'upi'
                                      }
                                  }], $position: 0
                              }
                          }
                      })
                  }
              } else {
                  if (req.body.newFormData.walletDebit) {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{ //////
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total),
                                      razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                      razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                      walletDebit: req.body.newFormData.walletDebit,
                                      balanceToSettle: {
                                          balance: 0,
                                          settledMode: 'upi'
                                      }
                                  }], $position: 0
                              }
                          }

                      })
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $inc: {
                              "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                          },
                          $push: {
                              "wallet.transaction": {
                                  $each: [
                                      {
                                          typeOfTransaction: 'debit',
                                          amount: parseFloat(req.body.newFormData.walletDebit)
                                      }
                                  ], $position: 0

                              }
                          }
                      })
                  } else {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment,
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: req.body.newFormData.total,
                                      razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                      razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                      balanceToSettle: {
                                          balance: 0,
                                          settledMode: 'upi'
                                      }
                                  }], $position: 0
                              }
                          },
                      })
                  }
              }


          } else {////////////////////////////////////////////////
              if (req.body.newFormData.couponId) {
                  if (req.body.newFormData.walletDebit) {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                      couponId: req.body.newFormData.couponId,
                                      couponValue: req.body.newFormData.couponValue,
                                      walletDebit: req.body.newFormData.walletDebit,
                                      balanceToSettle: {
                                          balance: req.body.newFormData.balaceToPay

                                      }
                                  }], $position: 0
                              }
                          }

                      })
                      // +====
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $inc: {
                              "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                          },
                          $push: {
                              "wallet.transaction": {
                                  $each: [
                                      {
                                          typeOfTransaction: 'debit',
                                          amount: parseFloat(req.body.newFormData.walletDebit)
                                      }
                                  ], $position: 0

                              }
                          }
                      })
                  } else { //////////////
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment,
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                      couponId: req.body.newFormData.couponId,
                                      couponValue: req.body.newFormData.couponValue,
                                      balanceToSettle: {
                                          balance: parseFloat(req.body.newFormData.balaceToPay) - parseFloat(req.body.newFormData.couponValue)

                                      }
                                  }], $position: 0
                              }
                          }
                      })
                  }
              } else {
                  if (req.body.newFormData.walletDebit) {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: parseInt(req.body.newFormData.total),
                                      walletDebit: req.body.newFormData.walletDebit,
                                      balanceToSettle: {
                                          balance: req.body.newFormData.balaceToPay

                                      }
                                  }], $position: 0
                              }
                          }
                      })

                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $inc: {
                              "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                          },
                          $push: {
                              "wallet.transaction": {
                                  $each: [
                                      {
                                          typeOfTransaction: 'debit',
                                          amount: parseFloat(req.body.newFormData.walletDebit)
                                      }
                                  ], $position: 0

                              }
                          }
                      })
                  } else {
                      await UserModal.updateOne({ _id: req.session.userId }, {
                          $push: {
                              orders: {
                                  $each: [{
                                      product: req.body.newFormData.productData,
                                      modeOfPayment: req.body.newFormData.modeOfPayment,
                                      addressToShip: req.body.newFormData.addressId,
                                      netTotal: req.body.newFormData.total,
                                      grossTotal: req.body.newFormData.total,
                                      balanceToSettle: {
                                          balance: req.body.newFormData.balaceToPay

                                      }

                                  }], $position: 0
                              }
                          }
                      })
                  }
              }
          }
          await Promise.all(req.body.newFormData.productData.map(async (product) => {
              let count = product.orderQuantity;
              try {
                  await ProductModal.updateOne(
                      { _id: product.productId },
                      { $inc: { quantity: -count } }
                  );
              } catch (error) {
                  console.error('Error updating product quantity:', error);
                  // Handle the error, such as logging it or sending an error response.
              }
          }));
          res.json({ success: true })
          req.body.newFormData = false
      }
  } catch (error) {
      errorHandler(error, req, res, next)

  }
}

module.exports = {
  getCheckOutPage,
  postBuySelectedProducts,
  postOrderPlacement,
}