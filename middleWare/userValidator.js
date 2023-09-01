
const validateUser = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/Home')
    } else {
       next()
    }
}

const userSessionHandler = (req,res,next)=>{

    if(req.cookies.userId){
        next()
    }else{
        res.redirect('/adminLogin')
    }
}



module.exports = {validateUser,userSessionHandler}
