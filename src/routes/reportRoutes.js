const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');


router.post('/', verifyToken, reportController.createReport);
router.get('/my-reports', verifyToken, reportController.getUserReports);
router.get('/all', verifyToken, verifyAdmin, reportController.getAllReports);
<<<<<<< HEAD
router.get('/public', verifyToken, reportController.getPublicReports);
router.put('/:id/status', verifyToken, verifyAdmin, reportController.updateReportStatus);
=======
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c

module.exports = router;