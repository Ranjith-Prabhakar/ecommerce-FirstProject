const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const { errorHandler } = require('../middleWare/errorMiddleWare')

const getProfile = async (req, res, next) => {
  try {
      const user = await UserModal.findOne({ _id: req.session.userId })
      let brands = await BrandModal.distinct('brandName')
      res.render('users/userProfile', { user, brands })
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}

const postaddProfileImage = async (req, res, next) => {
  try {
      await UserModal.updateOne({ _id: req.body.userId }, { $set: { profImage: req.file.filename } })
      res.redirect(`/profile?userId=${req.body.userId}`);
  } catch (error) {
      errorHandler(error, req, res, next);
  }
}
const postCreateAddress = async (req, res, next) => {
  try {
      const formDataObject = req.body.formDataObject; // Assign formDataObject from request body
      await UserModal.updateOne(
          { _id: req.session.userId },
          { $push: { shippingAddress: { $each: [formDataObject], $position: 0 } } }
      );
      res.json({ success: true })
  } catch (error) {
      errorHandler(error, req, res, next);
  }
};
const postEditAddress = async (req, res, next) => {
  try {
      if (req.body.userObject) {
          let { firstName, lastName, email, phone } = req.body.userObject
          await UserModal.updateOne({ _id: req.session.userId }, {
              $set: {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  phone: phone,
              }
          })
          userObject = ""
          res.json({ success: true })
      } else {
          let userId = req.session.userId
          let index = req.body.index
          let newObject = req.body.newAddressFormData
          delete newObject.userId
          await UserModal.updateOne({ _id: userId }, { $set: { [`shippingAddress.${index}`]: newObject } })
          res.json({ success: true })
      }
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}

const postDeleteAddress = async (req, res, next) => {
  try {
      const { userId, index, objectId } = req.body
      await UserModal.updateOne({ _id: req.session.userId }, { $pull: { shippingAddress: { _id: objectId } } });
      res.json({ success: true })
  } catch (error) {
      errorHandler(error, req, res, next)
  }
}

module.exports ={
  getProfile,
  postaddProfileImage,
  postCreateAddress,
  postEditAddress,
  postDeleteAddress,
}