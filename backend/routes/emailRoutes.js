const express = require('express');
const router = express.Router();

const Email = require('../models/Email');
const transporter = require('../config/mailer');

// Send bulk email
router.post('/send', async (req, res) => {
    let emailRecord;

    try {
        const { subject, body, recipients } = req.body;

        if (!subject?.trim() || !body?.trim() ||
            !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                message: 'Please provide subject, body and recipients.'
            });
        }

        // Save email details in MongoDB
        emailRecord = await Email.create({
            subject,
            body,
            recipients,
            status: 'pending'
        });

        // Send email using Gmail
        await transporter.sendMail({
            from: `"BulkMail" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            bcc: recipients,
            subject: subject,
            text: body
        });

        // Update status after successful delivery to SMTP server
        emailRecord.status = 'sent';
        emailRecord.sentAt = new Date();

        await emailRecord.save();

        res.status(200).json({
            message: 'Email sent successfully!',
            email: emailRecord
        });

    } catch (error) {

        if (emailRecord) {
            emailRecord.status = 'failed';
            await emailRecord.save();
        }

        console.error('Email sending error:', error.message);

        res.status(500).json({
            message: 'Email sending failed.',
            error: error.message
        });
    }
});

// Get email history
router.get('/history', async (req, res) => {
    try {
        const emails = await Email.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Email history fetched successfully!',
            emails
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch email history.',
            error: error.message
        });
    }
});

// Get Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        const totalEmails = await Email.countDocuments();

        const successfulEmails = await Email.countDocuments({
            status: 'sent'
        });

        const failedEmails = await Email.countDocuments({
            status: 'failed'
        });

        // Calculate total recipients
        const recipientStats = await Email.aggregate([
            {
                $project: {
                    recipientCount: {
                        $size: { $ifNull: ['$recipients', []] }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRecipients: {
                        $sum: '$recipientCount'
                    }
                }
            }
        ]);

        const totalRecipients =
            recipientStats.length > 0
                ? recipientStats[0].totalRecipients
                : 0;

        // Get five recent emails
        const recentEmails = await Email.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalEmails,
            totalRecipients,
            successfulEmails,
            failedEmails,
            recentEmails
        });

    } catch (error) {
        console.error('Dashboard stats error:', error.message);

        res.status(500).json({
            message: 'Unable to fetch dashboard statistics.'
        });
    }
});

module.exports = router;
