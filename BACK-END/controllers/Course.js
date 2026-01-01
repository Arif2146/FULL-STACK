const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const {uploadImageToCloudinary }= require('../utils/imageUploader');




//create Course
exports.createCourse = async (req,res) => {
    try{
       const {courseName,courseDescription,whatYouWillLearn,price,tags } = req.body;   
       const thumbnail = req.files.thumbnailImage;
       if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){
        return res.status(400).json({ message: "All fields are required", success: false });
       }
       const userId =req.user.id;
       const instructorDetails = await User.findById(userId);
       console.log("Instructor details:",instructorDetails);
       if(!instructorDetails){
        return res.status(404).json({ message: "instructor Details not found", success: false });
       }
       const tagDetails = await Tag.findById(tags);
       console.log("Tag details:",tagDetails);
       if(!tagDetails){
        return res.status(404).json({ message: "Tag Details not found", success: false });
       }
       const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
       

       const newCourse =  await Course.create({
           courseName,
           courseDescription,
           whatYouWillLearn: whatYouWillLearn,
           price,
           tags: tagDetails._id,
           thumbnail: thumbnailImage.secure_url,
           instructor: instructorDetails._id,
       })

       await User.findByIdAndUpdate({
           _id: instructorDetails._id
       },
    { $push: { courses: newCourse._id } },
    { new: true },
    );

    return res.status(201).json({ message: "Course created successfully", success: true,data: newCourse });
    }
    catch(error){
        res.status(500).json({ message: "failed to create course", success: false,error: error.message });
    }
}
//get a course
