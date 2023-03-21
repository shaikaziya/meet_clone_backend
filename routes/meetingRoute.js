const express = require("express");
const { createMeeting } = require("../controllers/meetingController.js");
const { getMeeting } = require("../controllers/meetingController.js");

const router = express.Router();

//create new meeting
router.route('/create').post(createMeeting);

//get a meeting
router.route("/:id").get(getMeeting);

module.exports = router;