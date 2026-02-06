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
