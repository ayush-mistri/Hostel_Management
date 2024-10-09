const express = require('express');
const router = express.Router();
const { createAnnouncement } = require('../controllers/announcementController');

// POST request to create an announcement
router.post('/create', createAnnouncement);

module.exports = router;
