const express = require('express');
const { register, login, getMe, googleAuth, updateDetails, updatePassword, deleteAccount } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.delete('/deleteaccount', protect, deleteAccount);

module.exports = router;
