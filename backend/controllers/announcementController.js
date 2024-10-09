const Announcement = require('../models/Announcement');
const Admin = require('../models/Admin'); // Assuming you're using an Admin model

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, studentId } = req.body;

    if (!title || !description || !studentId) {
      return res.status(400).json({ success: false, message: 'Title, description, and student ID are required' });
    }

    // Create and save the announcement
    const newAnnouncement = new Announcement({
      admin: studentId, // Use studentId instead of student
      title,
      description
    });

    await newAnnouncement.save();
    res.status(201).json({ success: true, message: 'Announcement created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
