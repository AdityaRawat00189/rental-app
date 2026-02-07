const express = require('express')
const router = express.Router();
const {createItem} = require('../controllers/itemController')
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 'images' is the key name we will use in Postman/Frontend
// '5' is the maximum number of images allowed
router.post('/create', protect, upload.array('images',5), createItem);

module.exports = router;