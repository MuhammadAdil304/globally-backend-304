const express = require('express')  
const AuthController = require('../controller/authController')
const route = express.Router()

route.get('/',AuthController.getUsers)
route.post('/login', AuthController.login)
route.post('/signUp', AuthController.signUp)
route.get('/checkAuth' , AuthController.CheckAuth)
route.put('/:id/joinTeam' , AuthController.UserStatus)

module.exports = route