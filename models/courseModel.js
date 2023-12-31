const mongoose = require('mongoose')
const CourseScheema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    taskStatus: {
        type: String,
        enum: ['pending', 'completed'], 
        default: 'pending',
    },
     teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  
},
    {
        timestamps: true
    })

const CourseModel = mongoose.model('/tasks', CourseScheema)

module.exports = CourseModel