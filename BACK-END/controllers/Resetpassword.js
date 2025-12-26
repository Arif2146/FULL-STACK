const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');



exports.resetPasswordToken = async (req, res) => {
    try{
            const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found with this email',
        });
    }
    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
        { email: email },
        {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
        },
        { new: true }
    )
    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(
        email,
        'Reset Your Password',
        `Click on the link to reset your password: ${url}. This link will expire in 5 minutes.`
    );
    res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email',
    });
    }
    catch(error){
        console.error('Error in resetPasswordToken:', error);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
    }

}


//reset password


exports.resetPassword = async (req, res) => {
    try{
       const {password, confirmPassword, token} = req.body;
       if (password !==confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match',
        });
    };
    const userDetails = await User.findOne({ token : token });
    if (! userDetails) {
        return res.status(404).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Token has expired',
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
        { token: token },
        {
            password: hashedPassword,
        },
        { new: true }
    );
    res.status(200).json({
        success: true,
        message: 'Password reset successfully',
    });
}
    catch(error){
        console.error('Error in resetPassword:', error);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
    }
}