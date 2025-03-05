const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerStudent, getStudent, getAllStudents, updateStudent, deleteStudent, csvStudent } = require('../controllers/studentController');
const { Student } = require('../models/Student');

// routes/studentRoutes.js
// Add the following route to fetch all student
router.get("/", async (req, res) => {
    console.log("GET /api/student called"); // Debug log
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// @route  POST api/student/register-student
// @desc   Register student
// @access Public
router.post('/register-student', [
    check('name', 'Name is required').not().isEmpty(),
    check('cms_id', 'CMS ID of at least 6 digit is required').isLength(6),
    check('room_no', 'Room number is required').isLength(3),
    check('batch', 'Batch is required').not().isEmpty(),
    check('dept', 'Department is required').not().isEmpty(),
    check('course', 'Course is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('father_name', 'Father name is required').not().isEmpty(),
    check('contact', 'Enter a valid contact number').isLength(10),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('cnic', 'Enter valid CNIC').isLength(12),
    check('hostel', 'Hostel is required').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
], registerStudent);

// @route  POST api/student/get-student
// @desc   Get student by CMS ID
// @access Public
router.post('/get-student', [
    check('isAdmin', 'isAdmin is required').notEmpty(),
    check('token', 'You donot have a valid token').notEmpty()
], getStudent);

// @route  POST api/student/get-all-students
// @access Public
router.post('/get-all-students',[
    check('hostel', 'Hostel is required').not().isEmpty()
],
 getAllStudents);

// @route  POST api/student/update-student
// @desc   Update student
// @access Public
router.post('/update-student', [
    check('cms_id', 'CMS ID is required').not().isEmpty(),
    check('room_no', 'Room number is required').not().isEmpty(),
    check('batch', 'Batch is required').not().isEmpty(),
    check('dept', 'Department is required').not().isEmpty(),
    check('course', 'Course is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('father_name', 'Father name is required').not().isEmpty(),
    check('contact', 'Contact is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('cnic', 'CNIC is required').not().isEmpty(),
    check('user', 'User is required').not().isEmpty(),
    check('hostel', 'Hostel is required').not().isEmpty()
], updateStudent);

// @route  POST api/student/delete-student
// @desc   Delete student
// @access Public
router.delete('/delete-student', [
    check('id', 'Enter a valid ID').not().isEmpty(),
], deleteStudent);

// @route  POST api/student/csv
// @desc   Get CSV of students
// @access Public
router.post('/csv', [
    check('hostel', 'Hostel is required').not().isEmpty()
], csvStudent);


module.exports = router;

