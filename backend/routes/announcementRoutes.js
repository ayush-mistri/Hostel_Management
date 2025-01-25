// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Admin = require('../models/Admin'); // Assuming you have an Admin model

// Middleware to check if the user is an admin
const checkAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.body.adminId);
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Access denied, admin required' });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// routes/announcementRoutes.js
// Add the following route to fetch all announcements
router.get('/', async (req, res) => {
    try {
      const announcements = await Announcement.find(); // Do not populate the admin field
  
      if (!announcements.length) {
        return res.status(404).json({ success: false, message: 'No announcements found' });
      }
  
      res.status(200).json({
        success: true,
        announcements,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

// Create announcement route
router.post('/create', checkAdmin, async (req, res) => {
  try {
    const { adminId, title, description } = req.body;

    // Ensure that all fields are provided
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Create and save the announcement
    const newAnnouncement = new Announcement({
      admin: adminId, // Store the admin ID who created this announcement
      title,
      description,
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: savedAnnouncement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
