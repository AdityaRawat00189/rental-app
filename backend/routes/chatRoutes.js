const express = require('express');
const router = express.Router();

const { accessChat, getConversations, getMessages} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, accessChat);
router.get('/inbox', protect, getConversations);
router.get('/messages/:conversationId', protect, getMessages);


module.exports = router;