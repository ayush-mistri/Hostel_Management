const { validationResult } = require('express-validator');
const { Leave, Student } = require('../models');

// @route   POST api/leave/request
// @desc    Request for mess off
// @access  Public
exports.requestLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, message: errors.array() });
    }

    const { student, leaving_date, return_date } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);
    if (!leaving_date) {
        return res.status(400).json({ success, message: "Leaving date is required." });
    }

    const leavingDate = new Date(leaving_date).setHours(0, 0, 0, 0);
    if (leavingDate < today) {
        return res.status(400).json({ success, message: "Leaving date cannot be in the past." });
    }

    if (return_date) {
        const returnDate = new Date(return_date).setHours(0, 0, 0, 0);
        if (returnDate <= leavingDate) {
            return res.status(400).json({ success, message: "Return date must be after leaving date." });
        }
    }

    try {
        const messOff = new Leave({
            student,
            leaving_date,
            return_date: return_date || null
        });

        await messOff.save();
        success = true;
        return res.status(200).json({ success, message: "Mess off request sent successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, message: "Server Error" });
    }
};

// @route   GET api/leave/count
// @desc    Get mess off requests count
// @access  Private
exports.countLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, message: errors.array() });
    }

    const { student } = req.body;
    try {
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const list = await Leave.find({
            student,
            leaving_date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        });

        success = true;
        return res.status(200).json({ success, list });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, message: "Server Error" });
    }
};

// @route   GET api/leave/list
// @desc    Get all mess off requests
// @access  Public
exports.listLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, message: errors.array() });
    }

    const { hostel } = req.body;
    try {
        const students = await Student.find({ hostel }).select('_id');
        const studentIds = students.map(student => student._id);

        // Fetch all mess-off records for this hostel
        const list = await Leave.find({
            student: { $in: studentIds }
        }).populate('student', ['name', 'room_no']);

        // Count students with a recorded leaving date
        const totalLeavingCount = list.filter(req => req.leaving_date).length;

        // Count students where return_date is NOT NULL (have returned)
        const totalReturnedCount = list.filter(req => req.return_date !== null).length;

        // Calculate difference
        const finalDifference = totalLeavingCount - totalReturnedCount;

        success = true;
        return res.status(200).json({ 
            success, 
            list, 
            totalLeavingCount, 
            totalReturnedCount, 
            finalDifference 
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, message: "Server Error" });
    }
};




// @route   POST api/leave/update
// @desc    Update mess off request
// @access  Public
exports.updateLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, message: errors.array() });
    }

    const { id, return_date } = req.body;
    try {
        const messOff = await Leave.findById(id);
        if (!messOff) {
            return res.status(404).json({ success, message: "Mess off request not found" });
        }

        if (return_date) {
            const returnDate = new Date(return_date).setHours(0, 0, 0, 0);
            const leavingDate = new Date(messOff.leaving_date).setHours(0, 0, 0, 0);

            if (returnDate <= leavingDate) {
                return res.status(400).json({ success, message: "Return date must be after the leaving date." });
            }
            messOff.return_date = return_date;
        }

        await messOff.save();
        success = true;
        return res.status(200).json({ success, message: "Mess off request updated successfully", messOff });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, message: "Server Error" });
    }
};
