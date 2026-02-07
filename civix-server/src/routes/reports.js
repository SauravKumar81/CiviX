const express = require('express');
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  addComment,
  shareReport,
  getTrendingTags
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
  .put(protect, upload.single('image'), updateReport)
  .delete(protect, deleteReport);

router.route('/:id/comment').post(protect, addComment);
router.route('/:id/share').post(protect, shareReport);
router.get('/tags/trending', getTrendingTags);

module.exports = router;
