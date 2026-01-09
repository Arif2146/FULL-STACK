const Section = require('../models/Section');
const Course = require('../models/Course');


exports.createSection = async (req, res) => {
    try {
         //data fetch
         const {sectionName,courseId}= req.body;
         //data val
         if(!sectionName || !courseId){
            return res.status(400).json({ message: "All fields are required", success: false });
         }
          //create sec
         const newSection = await Section.create({sectionName});
         //ubdate course
         const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
         );
         //return res
         return res.status(201).json({ message: "Section created successfully", success: true,updatedCourseDetails });
    }catch (error) {
        res.status(500).json({ message:`unabel to create section cause of error: ${error.message}`, success: false, });
    }
}