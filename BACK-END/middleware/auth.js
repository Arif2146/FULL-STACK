const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


//auth
exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token not found' ,success:false});  
        }
        

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' ,success:false});
    }
    next();
    } catch (error) {
        return res.status(401).json({success:false, message: 'Something went wrong' });
    }
}



//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Student') {
            return res.status(403).json({ message: 'You are not a student' ,success:false});
        } 
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' ,success:false});
    }
}




//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Instructor') {
            return res.status(403).json({ message: 'You are not an instructor' ,success:false});
        } 
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' ,success:false});
    }
}

//isAdmin

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Admin') {
            return res.status(403).json({ message: 'You are not an admin' ,success:false});
        } 
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' ,success:false});
    }
}
