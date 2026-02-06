const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res, next) => {
  try {
    const query = {};

    // Filter by city/state if provided
    if (req.query.city) {
      query['location.city'] = req.query.city;
    }
    if (req.query.state) {
      query['location.state'] = req.query.state;
    }
    if (req.query.user) {
      query.user = req.query.user;
    }

    const reports = await Report.find(query).sort({ createdAt: -1 }).populate({
      path: 'user',
      select: 'name rank'
    });

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
