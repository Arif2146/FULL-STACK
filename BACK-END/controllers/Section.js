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
        res.status(500).json({ message:`unabel to create section cause of error: ${error.message}`, success: false,});
    }
}
exports.updateSections = async (req, res) => {
    try {
        //data input
        const {sectionName,sectionId}= req.body;
        //data validate
        if(!sectionName || !sectionId){
            return res.status(400).json({ message: "All fields are required", success: false });
         }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return res
        return res.status(200).json({ message: "Section updated successfully", success: true,});
        //return res
    }catch (error) {
        res.status(500).json({ message: `unabel to update section cause of error: ${error.message}`, success: false, });
    }

}