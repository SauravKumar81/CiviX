const { toggleBookmark, getBookmarks, followUser, unfollowUser, getUserProfile, updateUserProfile } = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/bookmark/:id', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

// Social Routes
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
