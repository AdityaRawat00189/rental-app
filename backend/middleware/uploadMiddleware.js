const cloudinary = require('cloudinary').v2;
const { cloudinaryStorage, CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define Storage Logic
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Dormify_Items', // Name in cloudinary
        allowed_formats: ['jpg','png','jpeg','webp'],
        transformation : [{width: 1000, height: 1000, crop: 'limit'}]
    }
});

// 3. Initilize Multer
const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024} // 5MB limit per image
});

console.log("hii from upload middleware")

module.exports = upload;