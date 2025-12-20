const mongoose = require('mongoose');

const CourseProgress = new mongoose.Schema({
   courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
   },
   completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
    }],
});
module.exports = mongoose.model('CourseProgress', CourseProgress);