const Report = require('../models/Report');

const User = require('../models/User'); // Ensure User model is required

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res, next) => {
  try {
    const query = {};

    // Filter by city/state if provided (Legacy / Fallback)
    if (req.query.city && !req.query.lat) {
      query['location.city'] = req.query.city;
    }
    if (req.query.state && !req.query.lat) {
      query['location.state'] = req.query.state;
    }
    if (req.query.user) {
      query.user = req.query.user;
    }

    // Filter by Following
    if (req.query.following === 'true' && req.user) {
         const currentUser = await User.findById(req.user.id);
         if (currentUser && currentUser.following.length > 0) {
             query.user = { $in: currentUser.following };
         } else {
             // If following no one, return nothing for this filter
             return res.status(200).json({ success: true, count: 0, data: [] });
         }
    }

    // Geospatial Query ($near)
    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }


    // Text Search
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex }
      ];
    }

    // Sort Filter
    if (req.query.sort === 'official') {
      query.isVerified = true;
    }

    let reports = await Report.find(query).populate({
      path: 'user',
      select: 'name rank'
    });

    // Custom Sorting Logic
    if (req.query.sort === 'trending') {
      reports.sort((a, b) => {
        const scoreA = (a.upvotes || 0) + (a.shares || 0) * 2 + (a.comments ? a.comments.length : 0);
        const scoreB = (b.upvotes || 0) + (b.shares || 0) * 2 + (b.comments ? b.comments.length : 0);
        return scoreB - scoreA;
      });
    } else if (req.query.sort === 'newest') {
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (req.query.lat && req.query.lng) {
        // Geospatial sort happens implicitly or via our previous custom sort
        reports.sort((a, b) => {
            const scoreA = (a.isVerified ? 100 : 0) + (a.upvotes || 0) + (a.shares || 0) * 2;
            const scoreB = (b.isVerified ? 100 : 0) + (b.upvotes || 0) + (b.shares || 0) * 2;
            return scoreB - scoreA;
        });
    } else {
        // Default: Newest
        reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate({
      path: 'user',
      select: 'name rank'
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    console.log('--- CREATE REPORT DEBUG ---');
    console.log('Body:', req.body);
    console.log('User:', req.user ? req.user.id : 'NO USER');
    console.log('File:', req.file ? req.file.path : 'NO FILE');

    const reportData = { ...req.body };
    
    // Add user to reportData
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    reportData.user = req.user.id;

    // Add image URL if uploaded
    if (req.file) {
      reportData.imageUrl = req.file.path;
    }

    // If location is sent as stringified JSON (common with FormData), parse it
    if (typeof reportData.location === 'string') {
      try {
        console.log('Parsing location string...');
        reportData.location = JSON.parse(reportData.location);
      } catch (e) {
        console.error('Location parsing error:', e);
      }
    }

    // Extract hashtags from description
    if (reportData.description) {
      const tags = reportData.description.match(/#[a-z0-9_]+/gi) || [];
      reportData.tags = [...new Set(tags.map(tag => tag.substring(1).toLowerCase()))]; // Unique & Lowercase
    }



    console.log('Final Report Data:', reportData);

    const report = await Report.create(reportData);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Create Report Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Make sure user is report owner
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this report' });
    }

    const updateData = { ...req.body };

    // Add new image URL if uploaded
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    // Parse location if stringified (FormData)
    if (typeof updateData.location === 'string') {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (e) {
        // Fallback
      }
    }

    // Extract hashtags from description if it's being updated
    if (updateData.description) {
         const tags = updateData.description.match(/#[a-z0-9_]+/gi) || [];
         updateData.tags = [...new Set(tags.map(tag => tag.substring(1).toLowerCase()))];
    }

    report = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Make sure user is report owner
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add comment to report
// @route   POST /api/reports/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const comment = {
      user: req.user.id,
      userName: req.user.name,
      text: req.body.text
    };

    report.comments.unshift(comment);

    await report.save();

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Share report
// @route   POST /api/reports/:id/share
// @access  Private
exports.shareReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.shares = (report.shares || 0) + 1;

    await report.save();

    res.status(200).json({
      success: true,
      data: report
    });
    await report.save();

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get trending tags
// @route   GET /api/reports/tags/trending
// @access  Public
exports.getTrendingTags = async (req, res, next) => {
  try {
    const tags = await Report.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: { $toLower: '$tags' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: tags.map(t => ({ tag: t._id, count: t.count }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
