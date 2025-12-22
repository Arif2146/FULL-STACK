const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
//sign up
exports.signUp = async (req, res) => {
    try{
        //data from req body
        const { email, password, firstName, lastName,confirmPassword,accountType,contactNumber,otp } = req.body; 
         //validate
        if(!email || !password || !firstName || !lastName || !confirmPassword ||  !otp){
            return res.status(403).json({ success: false, message: 'All fields are required' });
        }
        //2 pass match
        if(password !== confirmPassword){
            return res.status(403).json({ success: false, message: 'Passwords do not match, try again' });
        }
        //user exists or not 
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(401).json({ success: false, message: 'User already exists, please login' });
        }
        //find most recent otp in DB
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recent otp: ", recentOtp);
        //validAte otp
        if(recentOtp.length === 0){ 
            return res.status(400).json({ success: false, message: 'OTP not found, please request for a new OTP' });
        }else if(recentOtp.otp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP, please try again' });
        }
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 
        //entry in DB
        const profileDetails = await ProfileDetails.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(201).json({ success: true, message: 'User registered successfully', user });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}


//Login
exports.login = async (req, res) => {
    try{
        //get data from req body
        const { email, password } = req.body;
        //validate
        if(!email || !password){
            return res.status(403).json({ success: false, message: 'All fields are required' });
        }
        //check user exists pr not
        const user = await User.findOne({ email }).populate('additionalDetails');
        if(!user){
            return res.status(401).json({ success: false, message: 'User not found, please sign up' });
        }
        //jwt after password matching
        if(!await bcrypt.compare(password, user.password)){
            const payload = { id: user._id, email: user.email,role: user.role, };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
            user.token = token;
            user.password = undefined; 


           //create coookie and send it in response
           const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000), //3 days
            httpOnly: true,
           }
           res.cookie("token", token, options).status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token,
          }); 
        }else{
            return res.status(401).json({ success: false, message: 'Incorrect password, please try again' });
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: `Login faliure: ${err.message}` });
    }
}

//Change pass

exports.changePassword = async (req, res) => {
    
}