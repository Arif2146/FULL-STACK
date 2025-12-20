const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 5*60 }
});

async function sendVerificationEmail(email, otp) {
    try {
       const mailResponce = await mailSender(email, 'Your OTP Code from StudyNotion', `<h1>Your OTP is ${otp}</h1><p>This OTP is valid for 5 minutes.</p>`);
       console.log('OTP email sent successfully:', mailResponce);
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
}

OTPSchema.pre('save', async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});



module.exports = mongoose.model('OTP', OTPSchema);