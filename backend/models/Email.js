const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        required: true
    },

    recipients: {
        type: [String],
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'partial'],
        default: 'pending'
    },

    sentAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);
