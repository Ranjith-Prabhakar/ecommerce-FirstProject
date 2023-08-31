const multer = require('multer')
const path = require('path')

// multer for product
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/productImages")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })


//multer for user profile

const profileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/userImages')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const profileImageUpload = multer({storage:profileStorage})

module.exports = {upload,profileImageUpload}

