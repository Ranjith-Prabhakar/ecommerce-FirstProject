// express
const express = require('express')
const app = express()
require('dotenv').config()
const path=require('path')
const PORT = process.env.PORT || 5000

// data base
const  mongoDb = require('./configuration/mongoDb')
mongoDb()
//cron-for scheduling a middleware
const cron = require('node-cron')

//importing routers
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const userManagementRoute = require('./routes/userManagementRoute')
const bannerRoute = require('./routes/bannerRoute')
const brandRoute = require('./routes/brandRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
const couponRoute = require('./routes/couponRoute')
const returnRoute = require('./routes/returnRoute')
//importing scheduling middleware
const couponExpiryMiddleWare = require('./middleWare/couponExpiry')
//activation of coupon scheduling using corn
cron.schedule('0 0 * * *', () => {//it will call every day at midnight
    couponExpiryMiddleWare.updateExpiredCoupons();
  });



//static file managment
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));


//body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//view engine activation
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

// logger
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};
app.use(logger)

//session and cookie activation
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(session({
    secret: 'firstAttempt',
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser())

// cache clearing
app.use((req, res, next) => {
    res.set('cache-control', 'no-cache,no-store')
    next()
})

//activating routes
app.use(userRoute)
app.use(adminRoute)
app.use(bannerRoute)
app.use(brandRoute)
app.use(userManagementRoute)
app.use(productRoute)
app.use(orderRoute)
app.use(couponRoute)
app.use(returnRoute)




app.listen(PORT, () => console.log(`server has started on the port http://localhost:${PORT}`))