const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');


exports.sendOTP = async (req, res) => {
    try{
    const { email } = req.body;
    const checkUserPresence = await User.findOne({ email });

    if (checkUserPresence) {
        return res.status(401).json({success: false, message: 'User already exists' });
    }
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    console.log("otp generated: ",otp);
    let result = await OTP.findOne({ otp: otp });
    

    while (result) {
        otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = {otp, email};
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    return res.status(200).json({ success: true, message: 'OTP sent successfully', otp, });
}
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
 
}