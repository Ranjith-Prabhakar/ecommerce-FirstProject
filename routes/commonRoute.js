const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.isAdmin) {
        res.redirect('/digiWorld/admin/adminPanel')
    } else if (req.session.userId) {
        res.redirect('/digiWorld/user/userHome')
    }
    else {
        res.redirect('/digiWorld/user/userHome')
    }
})

module.exports = router



