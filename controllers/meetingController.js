const Meeting = require('../models/meetingModel.js');
const asyncHandler = require('express-async-handler');

const createMeeting = asyncHandler(async (req, res) => {
    const { id, peerId } = req.body;
    const newMeeting = new Meeting({ id, peerId })

    try {
        const meeting = await newMeeting.save();
        res.status(201).json(meeting)
    }
    catch (error) {
        res.status(500).json(error);
    }

});

const getMeeting = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const meeting = await Meeting.findOne({ id: id })
        res.status(200).json(meeting);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

module.exports = { createMeeting, getMeeting }
