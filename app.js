// express
const express = require('express')
const app = express()
require('dotenv').config()
const path=require('path')
const PORT = process.env.PORT || 5000

// data base
const  mongoDb = require('./configuration/mongoDb')
mongoDb()


//importing routers
const adminRoute = require('./routes/adminRoute')
const userManagementRoute = require('./routes/userManagementRoute')
const bannerRoute = require('./routes/bannerRoute')
const brandRoute = require('./routes/brandRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
const couponRoute = require('./routes/couponRoute')
const returnRoute = require('./routes/returnRoute')
const userRoute = require('./routes/userRoute')
const userProfileRoute = require('./routes/userProfileRoute')
const userCartRoute = require('./routes/userCartRoute')
const userCheckOutRoute = require('./routes/userCheckOutRoute')
const userOrderRoute = require('./routes/userOrderRoute')

//static file managment
// app.use(express.static('public'))
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use(express.static(path.join(__dirname, 'public')));

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
app.use(userProfileRoute)
app.use(userCartRoute)
app.use(userCheckOutRoute)
app.use(userOrderRoute)




app.listen(PORT, () => console.log(`server has started on the port http://localhost:${PORT}`))