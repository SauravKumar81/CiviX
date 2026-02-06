const express = require('express');
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reports');

const router = express.Router();

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router
  .route('/:id')
  .get(getReport)
  .put(protect, upload.single('image'), updateReport)
  .delete(protect, deleteReport);

module.exports = router;
