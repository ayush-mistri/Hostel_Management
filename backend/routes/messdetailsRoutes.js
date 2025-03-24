const express = require('express');
const { getMessDetails, updateMessDetails } =  require("../controllers/messdetailsController.js");

const router = express.Router();

router.get("/", getMessDetails);      
router.post("/update", updateMessDetails);

module.exports = router;
