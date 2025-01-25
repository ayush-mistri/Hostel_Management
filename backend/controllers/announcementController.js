const Announcement = require('../models/Announcement');
const Admin = require('../models/Admin'); 

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, adminId } = req.body;

    if (!title || !description || !adminId) {
      return res.status(400).json({ success: false, message: 'Title, description, and admin ID are required' });
    }

    // Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Create and save the announcement
    const newAnnouncement = new Announcement({
      admin: adminId,
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
