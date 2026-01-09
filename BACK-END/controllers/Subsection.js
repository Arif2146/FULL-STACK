const SubSection = require('../models/SubSection');
const Section = require('../models/Section');


exports.createSubSection = async (req, res) => {
    try {
        //fetch data from req body
        const {sectionId,title,timeDuration,description}=req.body;
        //extract video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
         return res.status(400).json({ message: "All fields are required", success: false });
        }
        //upload vidseo to cloud
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            video: uploadDetails.secure_url,
        });
        //ubdate
        const updatedSectionDetails = await Section.findByIdAndUpdate(
            {_id:sectionId},
            { $push: { subSections: SubSectionDetails._id } },
            { new: true }
        );

        //res
        return res.status(201).json({ message: "SubSection created successfully", success: true,updatedSectionDetails });

    }catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }    
}