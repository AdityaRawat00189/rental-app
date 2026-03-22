const express = require('express')
const router = express.Router();
const {createItem, getMyLendedItems, getItemById, deleteItem, updateItem, getItems} = require('../controllers/itemController')
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 'images' is the key name we will use in Postman/Frontend
// '5' is the maximum number of images allowed
router.post('/create', protect, upload.array('images',5), createItem);

// For All Items
router.get('/', protect, getItems);

// For All My Lended Items
router.get('/my-items', protect, getMyLendedItems);

// For Single Item
router.get('/:id', protect, getItemById);

// Delete listed item
router.delete('/:id', protect, deleteItem);

// Update listed item
router.put('/:id',protect, updateItem);

module.exports = router;