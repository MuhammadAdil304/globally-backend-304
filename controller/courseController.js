const { SendResponse } = require("../helpers/helpers");
const CourseModel = require("../models/courseModel");

const CourseController = {

    get: async (req, res) => {
        try {
            let { pageNo, pageSize } = req.query
            let skipPage = (pageNo - 1) * pageSize
            const getcoursesArr = await CourseModel.find().limit(pageSize).skip(skipPage)
            res.send(SendResponse(true, "", getcoursesArr))
        }
        catch (error) {
            res.status(404).send(SendResponse(false, "Data Not Found", error))
        }
    },
    getbyId: async (req, res) => {
        try {
            let id = req.params.id;
            let result = await CourseModel.findById(id);
            res.status(200).send(SendResponse(true, "ok", result));
        }
        catch (error) {
            res.status(404).send(SendResponse(false, error, null))
        }

    },
    add: async (req, res) => {
        try {
            const { title, description, } = req.body
            const obj = { title, description, }
            const errArr = []
            if (!obj.title) {
                errArr.push('Required title')
            }
            if (!obj.description) {
                errArr.push('Required description')
            }
            if (errArr.length > 0) {
                res.status(401).send(SendResponse(false, 'Crediantials Not Found ', errArr))
            }
            else {
                // obj.id = courses.length + 1
                // courses.push(obj)
                const course = new CourseModel(obj)
                const result = await course.save()
                res.status(200).send(SendResponse(true, "Data Added Successfully", result))
            }
        }
        catch (e) {
            res.send(SendResponse(false, "Data Not Added! :(", e))
        }
    },
    edit: async (req, res) => {
        try {
            const id = req.params.id
            const { title, description, } = req.body
            const obj = { title, description, }
            const errArr = []
            if (!obj.title) {
                errArr.push('Required title')
            }
            if (!obj.description) {
                errArr.push('Required description')
            }
            if (errArr.length > 0) {
                res.status(401).send(SendResponse(false, 'Crediantials Not Found ', errArr))
            }
            else {
                const result = await CourseModel.findByIdAndUpdate(id, obj)
                res.status(200).send(SendResponse(true, "Updated Successfully", result))
            }
        }
        catch (error) {
            res.status(404).send(SendResponse(false, error, null))
        }
    },
    del: async (req, res) => {
        const id = req.params.id
        try {
            const result = await CourseModel.findByIdAndDelete(id)
            res.status(200).send(SendResponse(true, "Deleted Successfully", result))
        }
        catch (error) {
            res.status(404).send(SendResponse(false, error, null))
        }
    },
    TaskCompleted: async (req, res) => {
        try {
            const TaskId = req.params.id
            const StatusCompleted = await CourseModel.findByIdAndUpdate(TaskId, { taskStatus: 'completed' }, { new: true })
            if (!StatusCompleted) {
                res.json({message :'Status Pending', })
            }
            return  res.json(StatusCompleted)
            
        }
        catch (error) {
            res.send(SendResponse(false, 'Internal Server Error', error))

        }
    }
}

module.exports = CourseController
