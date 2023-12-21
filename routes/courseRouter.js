const express = require('express')
const CourseController = require('../controller/courseController')
const AuthController = require('../controller/authController')
const route = express.Router()  

route.get('/' ,   CourseController.get)
route.get('/:id' , CourseController.getbyId)
route.post('/' , CourseController.add)
route.delete('/:id' , CourseController.del)
route.put('/:id' , CourseController.edit)
route.put('/:id/taskCompleted' , CourseController.TaskCompleted)

module.exports = route