// express
const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5000

//mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.MongoDbCollection)
    .then(() => console.log('mongoDb server also started exicution'))
    .catch((error) => console.log(error.message))

//importing routers
const commonRoute = require('./routes/commonRoute')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')

// morgan
// const morgan = require('morgan')
// app.use(morgan('tiny'))

//static file managment
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));


//body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//view engine activation
app.set('view engine', 'ejs')

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
app.use('/digiWorld/admin', adminRoute)
app.use('/digiWorld/user', userRoute)
app.use('/', commonRoute)


app.listen(PORT, () => console.log(`server has started on the port http://localhost:${PORT}`))