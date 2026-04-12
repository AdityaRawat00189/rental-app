const express = require('express');
const router = express.Router();

const {askBot} = require('../controllers/chatBotController');

router.post('/', askBot);

module.exports = router;