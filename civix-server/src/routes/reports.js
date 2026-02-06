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

router
  .route('/')
  .get(getReports)
  .post(protect, createReport);

router
  .route('/:id')
  .get(getReport)
  .put(protect, updateReport)
  .delete(protect, deleteReport);

module.exports = router;
