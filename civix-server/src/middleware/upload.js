const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civix-reports',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'], // CamelCase for v4
    resource_type: 'auto',
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Init Upload Middleware
const upload = multer({ storage: storage });

module.exports = upload;
