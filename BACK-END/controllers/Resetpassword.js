const User = require('../models/User');
const mailSender = require('../utils/mailSender');



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