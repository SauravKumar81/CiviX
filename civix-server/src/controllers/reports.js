const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate({
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
    // Add user to req.body
    req.body.user = req.user.id;

    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
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
