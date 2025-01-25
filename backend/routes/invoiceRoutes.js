const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { generateInvoices, getInvoicesbyid, getInvoices, updateInvoice } = require('../controllers/invoiceController');
const Student = require('../models/Student');  // Assuming you have a Student model

// @route   Generate api/invoice/generate
// @desc    Generate invoice
// @access  Public
router.post('/generate', [
    check('hostel', 'Hostel is required').not().isEmpty(),
], generateInvoices);

// @route   GET api/invoice/getbyid
// @desc    Get all invoices
// @access  Public
router.post('/getbyid', [
    check('hostel', 'Hostel is required').not().isEmpty()
], getInvoicesbyid);

// @route   GET api/invoice/student
// @desc    Get all invoices
// @access  Public
router.post('/student', [
    check('student', 'Student is required').not().isEmpty()
], getInvoices);

// @route   POST api/invoice/update
// @desc    Update invoice
// @access  Public
router.post('/update', [
    check('student', 'Student is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
], updateInvoice);

// @route   GET api/student/getEmail/:studentId
// @desc    Get student's email by ID
// @access  Public
router.get('/student/getEmail/:studentId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId); // Assuming you have a Student model
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, email: student.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
