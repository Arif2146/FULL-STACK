const Profile = require('../models/Profile');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {
        //data fetch
        const {gender,dateOfBirth="",about="",contactNumber}=req.body;
        //get userid
        const id = req.user.id;
        //validation
        if(!gender || !id || !contactNumber){
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return res
        return res.status(200).json({ message: "Profile updated successfully", success: true,profileDetails });
    } catch (error) {
       return res.status(500).json({ message: error.message, success: false });
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        //get userid
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({ message: "User not found", success: false });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //del user
        await User.findByIdAndDelete({_id:id});
        //return res
        return res.status(200).json({ message: "Profile deleted successfully", success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
}

exports.getAllUserDetails = async (req, res) => {
      try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate('additionalDetails').exec();
        return res.status(200).json({ message: "User details fetched successfully", success: true,userDetails });

      } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
      }
}