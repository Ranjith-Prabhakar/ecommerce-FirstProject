const validateAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        res.redirect('/adminPanel')
    } else {
       next()
    }
}

const adminSessionHandler = (req,res,next)=>{

    if(req.cookies.password){
        next()
    }else{
        res.redirect('/adminLogin')
    }
}

module.exports = {validateAdmin,adminSessionHandler}