const express = require('express');
const { sendMessage, allMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/").post(protect,sendMessage)
router.route("/:chatID").get(protect,allMessage)

module.exports = router
