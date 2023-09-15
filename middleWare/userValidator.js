const bcrypt = require('bcrypt')
const errorHandler = require('./errorMiddleWare')
// =====================================
const userRestriction = async (req, res, next) => {
    try {
        if (req.session.userId) {
            bcrypt.compare(req.cookies.userId, req.session.userHash, async (err, result) => {
                if (err) {
                    throw Error('cookie mismatching')
                } else {
                    res.redirect('/home')
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


const userSessionHandler = (req, res, next) => {

    if (req.cookies.userId && !req.session.userId || !req.cookies.userId && req.session.userId) {
        res.clearCookie('userId')
        next()
    } else {
        next()
    }
}

// =====================================
const userValidation = async (req, res, next) => {

    try {
        if (req.session.userId && req.cookies.userId) {

            bcrypt.compare(req.cookies.userId, req.session.userHash, async (err, result) => {
                if (err) {
                    res.redirect('/userLogin')
                } else {
                    next()
                }
            });
        } else {
            res.redirect('/userLogin')
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}


module.exports = { userRestriction, userSessionHandler,userValidation }
