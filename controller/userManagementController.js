const UserModal = require('../model/userModal')
const errorHandler = require('../middleWare/errorMiddleWare')




const getUserManagement = async (req, res) => {
    try {
        const users = await UserModal.find()
        res.render('./admin/userManagement/userManagement', { users, userManagement: true })
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}





const postEditConfirm = async (req, res) => {
    try {
        let {userId,status} = req.body.userData
            await UserModal.updateOne({ _id:userId }, { $set: { status:status } })
           res.json({success:true})
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}



const postDeleteConfirm = async (req, res) => {
    try {
        await UserModal.deleteOne({ _id: req.body.userId })
        res.json({success:true})
      

    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

module.exports = {
    getUserManagement,
    postEditConfirm,
    postDeleteConfirm,
}