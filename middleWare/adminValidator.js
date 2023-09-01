const bcrypt = require('bcrypt')
const errorHandler = require('./errorMiddleWare')
// =====================================
const adminRestriction = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            bcrypt.compare(req.cookies.password, req.session.adminHash, async (err, result) => {
                if (err) {
                    console.log(req.cookies.password);
                    console.log(req.session.adminHash);

                    throw Error('cookie mismatching')
                } else {
                    res.redirect('/adminPanel')
                }
            });
        } else {
            next()
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

// =====================================


const adminSessionHandler = (req, res, next) => {

    if (req.cookies.password && !req.session.isAdmin || !req.cookies.password && req.session.isAdmin) {
        res.clearCookie('password')
        next()
    } else {
        next()
    }
}
// =====================================
const adminValidation = async (req, res, next) => {

    try {
        if (req.session.isAdmin && req.cookies.password) {

            bcrypt.compare(req.cookies.password, req.session.adminHash, async (err, result) => {
                if (err) {
                    res.redirect('/adminLogin')
                } else {
                    next()
                }
            });
        } else {
            res.redirect('/adminLogin')
        }
    } catch (error) {
       
        errorHandler(error, req, res, next)
    }
}


module.exports = {adminRestriction,adminSessionHandler,adminValidation}