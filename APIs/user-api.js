// step 1 - defined express router
const exp = require('express')

// step 2 - create a route(mini-express app)
const userApp = exp.Router();

// step 3 - create express async handler
const expressAsyncHandler = require('express-async-handler');

// step 4 - import controller functions from the user-controller
const {getUser, createUser, loginUser, getUserByUsername, updateUser} = require('../Controllers/user-controller');


// step 5 - perform CRUD operations
// --------------------------------------------------------
// get request
userApp.get('/users', getUser)

// registerUser
userApp.post('/users', expressAsyncHandler(createUser))

// loginUser
userApp.post('/user', expressAsyncHandler(loginUser))

// get user by username
userApp.get('/users/:username', expressAsyncHandler(getUserByUsername))

// update user by userid
userApp.put('/users', expressAsyncHandler(updateUser))

// --------------------------------------------------------


// export the userApp to server.js
module.exports = userApp;