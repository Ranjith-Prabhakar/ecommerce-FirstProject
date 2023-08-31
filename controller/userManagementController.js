const UserModal = require('../model/userModal')




const getUserManagement = async (req, res) => {
    try {
        const users = await UserModal.find()
        res.render('./admin/userManagement/userManagement', { users, userManagement: true })
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postEditUserManagement = async (req, res) => {
    try {
        req.session.confirmEditUserManagement_id = req.body.id
        res.render('./admin/userManagement/editUserManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postEditSubmit = async (req, res) => {
    try {
        req.session.confirmEditUserManagement_status = req.body.status
        res.render('./admin/userManagement/confirmEditUserManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postEditConfirm = async (req, res) => {
    try {
        await UserModal.updateOne({ _id: req.session.confirmEditUserManagement_id }, { $set: { status: req.session.confirmEditUserManagement_status } })
        req.session.confirmEditUserManagement_id = ''
        req.session.confirmEditUserManagement_status = ''
        res.redirect('/userManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postDeleteUserManagement = async (req, res) => {
    try {
        req.session.deleteId = req.body.id,
            res.render('./admin/userManagement/confirmDeleteUserManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postDeleteConfirm = async (req, res) => {
    try {
        await UserModal.deleteOne({ _id: req.session.deleteId })
        req.session.deleteId = ''
        res.redirect('/userManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

module.exports = {
    getUserManagement,
    postEditUserManagement,
    postEditSubmit,
    postEditConfirm,
    postDeleteUserManagement,
    postDeleteConfirm,
}