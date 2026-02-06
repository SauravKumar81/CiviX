const express = require('express');
const { toggleBookmark, getBookmarks } = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/bookmark/:id', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
