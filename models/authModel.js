const mongoose = require('mongoose');
const AuthScheema = mongoose.Schema({
    firstName: {
        type: String,
        require: (true , "First Name must be required")
    },
    lastName: {
        type: String,
        require: (true , "Last Name must be required")
    },
    email: {
        type: String,
        require: (true  , "Email must be required")
    },
    password: {
        type: String,
        require: (true , "Password must be required")
    },
    
    userSelected: {
        type: String,
        enum: ['teamMembers' , 'users'],
        default:'users'
    },

    

    
  

})

const AuthModel = mongoose.model('/users', AuthScheema)

module.exports = AuthModel