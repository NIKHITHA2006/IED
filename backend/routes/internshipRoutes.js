const express = require('express');
const router = express.Router();
const { getInternships, createInternship, updateInternship, deleteInternship } = require('../controllers/internshipController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getInternships).post(protect, admin, createInternship);
router.route('/:id').put(protect, admin, updateInternship).delete(protect, admin, deleteInternship);

module.exports = router;
