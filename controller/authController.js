const { SendResponse } = require("../helpers/helpers")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const AuthModel = require("../models/authModel")

const AuthController = {
    signUp: async (req, res) => {
        try {
            const { email, password, firstName, lastName } = req.body
            const obj = { email, password, firstName, lastName,  }
            const errArr = []
            if (!obj.email) {
                errArr.push("Username is required")
            }
            if (!obj.password) {
                errArr.push("Password is required")
            }
            if (!obj.firstName) {
                errArr.push("firstName is required")
            }
            if (!obj.lastName) {
                errArr.push("lastName is required")
            }
            if (errArr.length > 0) {
                res.send(SendResponse(false, "Crediantials Not Found", errArr))
            }

            const checkUser = await AuthModel.findOne({ email: obj.email })
            if (checkUser) {
                res.send(SendResponse(false, "User Already Exist", null))
                return;
            }
            obj.password = await bcrypt.hash(obj.password, 10)
            const user = new AuthModel(obj)
            const result = await user.save()
            if (result) {
                res.send(SendResponse(true, "User Created Successfully", result))
            }

        }
        catch (error) {
            res.status(404).send(SendResponse(false, error, null))
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const obj = { email, password }
            const userExist = await AuthModel.findOne({ email: obj.email })
            if (userExist) {
                const correctPassword = await bcrypt.compare(obj.password, userExist.password)
                if (correctPassword) {
                    const token = jwt.sign({ ...userExist }, process.env.SECRET_KEY)
                    res.send(SendResponse(true, "Data Added Successfully", { user: userExist, token: token }))
                }
                else{
                    res.send(SendResponse(false, "Your Password is incorrect", { user: userExist, token: token }))
                }
            }

            else {
                res.status(404).send(SendResponse(false, 'Your Email is invalid', null))
            }
        }
        catch (error) {
            res.status(500).send(SendResponse(false, 'Internal Server Error', error))
        }
    },

    CheckAuth: async (req, res) => {
        try {
            const token = req.headers.authorization.replace('Bearer ', '')
            jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
                console.log(decode._doc)
                if (err) {
                    res.status(401).send(SendResponse(false, 'Un Authorized', err))
                }
                else {
                    res.status(200).send(SendResponse(true, 'Authorized', decode._doc))
                }
            })
        }
        catch (error) {
            res.status(500).send(SendResponse(false, 'Internal Server Error', error))
        }
    },
    getUsers: async (req, res) => {
        try {
            const allUsers = await AuthModel.find()
            res.status(200).send(SendResponse(true, 'all Users', allUsers))
        }
        catch (error) {
            res.status(404).send(SendResponse(true, 'You are No Rights for this Action', error))
        }
    },
    AdminProtected: async (req, res, next) => {
        try {
            const token = req.headers.authorization.replace('Bearer ', '')
            jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
                console.log(decode)
                if (err) {
                    res.send(SendResponse(false, 'User Un Authorized', err))
                }
                else {
                    res.send(SendResponse(true, 'Successfully Login', decode._doc))
                    next()
                }
            })
        }
        catch (error) {
            res.send(SendResponse(false, 'Server Error', error))
        }
    },
    UserStatus : async (req, res) => {
        try {
            const TaskId = req.params.id
            console.log(TaskId)
            const UserJoined = await AuthModel.findByIdAndUpdate(TaskId, { userSelected: 'teamMembers' }, { new: true })
            if (!UserJoined) {
                res.json({message :'users', })
            }
            return  res.json(UserJoined)
            
        }
        catch (error) {
            res.send(SendResponse(false, 'Internal Server Error', error))

        }
    }
}

module.exports = AuthController