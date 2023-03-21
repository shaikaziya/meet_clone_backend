const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    peerId: {
        type: String,
        required: true,
    }

}, { timestamps: true })

const Meeting = mongoose.model('MeetingInfo', meetingSchema);

module.exports = Meeting;