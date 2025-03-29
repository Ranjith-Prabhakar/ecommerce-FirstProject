const errorHandler = ((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    // res.status(error.statusCode).json({
    //     "status": error.statusCode,
    //     "message": error.message
    // });
    res.render('../views/errorPage/error.ejs', { message: error.message })
});
module.exports = {
    errorHandler
}