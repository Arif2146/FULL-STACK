const Tag = require('../models/Tags');


exports.createTag = async (req, res) => {
    try {
       const { name,description } = req.body;
       if(!name || !description){
        return res.status(400).json({ message: "Name and Description are required", success: false });
       }
       const tagDetails = await Tag.create({ name: name, description: description });
       console.log(tagDetails);
       res.status(201).json({ message: "Tag created successfully", success: true });
} catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}    
exports.getAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({ message: "Tags fetched successfully", success: true,allTags });

    }catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }    
}