const multer = require('multer')
const fs = require('fs');
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


// multer for profile pic ===============================================================================================

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/userImages');
    },
    filename: (req, file, cb) => {
        // Ensure the uploaded file will overwrite the existing one with the same name
        cb(null, `${req.session.userId}${path.extname(file.originalname)}`);
    },
    overwrite: true, // Enable overwriting existing files
});

const profileImageUpload = multer({storage:profileStorage})

// multer for banner ================================================

const bannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/bannerImages');
    },
    filename: (req, file, cb) => {
        const filename = `${req.body.imageName}${path.extname(file.originalname)}`;
        
        // Check if any file with the same name (regardless of extension) exists, and if so, delete it
        const directoryPath = 'public/bannerImages';
        const filesInDirectory = fs.readdirSync(directoryPath);
        
        filesInDirectory.forEach((fileInDirectory) => {
            if (fileInDirectory.startsWith(req.body.imageName)) {
                const filePath = path.join(directoryPath, fileInDirectory);
                fs.unlinkSync(filePath);
            }
        });

        cb(null, filename);
    },
    overwrite: true, // Enable overwriting existing files
});

const bannerImageUpload = multer({ storage: bannerStorage });





// multer for product image updation

const productImageUpdation = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/productImages")
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.oldImage}`); 
    },
    overwrite: true,
})

const productImageUpdate = multer({ storage: productImageUpdation })



module.exports = { upload, profileImageUpload, bannerImageUpload, productImageUpdate }



