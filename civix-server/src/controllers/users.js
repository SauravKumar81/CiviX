const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Toggle bookmark on a report
// @route   PUT /api/users/bookmark/:id
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Toggle
    const index = user.bookmarks.indexOf(reportId);
    if (index > -1) {
      user.bookmarks.splice(index, 1); // Remove
    } else {
      user.bookmarks.push(reportId); // Add
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.bookmarks
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'user', select: 'name' }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.bookmarks
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (userToFollow._id.toString() === req.user.id) {
        return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    // Add to following list if not already there
    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      await currentUser.save();
    }

    // Add to followers list if not already there
    if (!userToFollow.followers.includes(req.user.id)) {
      userToFollow.followers.push(req.user.id);
      await userToFollow.save();
    }

    res.status(200).json({ success: true, data: currentUser.following });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);
    await userToUnfollow.save();

    res.status(200).json({ success: true, data: currentUser.following });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email') // Hide sensitive info
      .populate('followers', 'name rank')
      .populate('following', 'name rank');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get basic stats
    const reports = await Report.find({ user: req.params.id });
    const reportCount = reports.length;
    const upvotes = reports.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

    const profileData = {
        _id: user._id,
        name: user.name,
        rank: user.rank,
        createdAt: user.createdAt,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        reportCount,
        impactScore: (reportCount * 5) + (upvotes * 10),
        followers: user.followers, // Send minimal list
        following: user.following
    };

    res.status(200).json({ success: true, data: profileData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      location: req.body.location,
      avatar: req.body.avatar
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
