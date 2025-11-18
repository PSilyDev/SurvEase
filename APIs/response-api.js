// step 1 - define express router
let exp = require('express')

// step 2 - create a route(mini-express app)
const responseApp = exp.Router()

// step 3 - define express async handler
const expressAsyncHandler = require('express-async-handler')

// step 4 - import controller functions from response-controller
const {getResponse, addResponse, deleteResponse} = require('../Controllers/response-controller')


const verifyToken = require('../Middlewares/verifyToken')

// step 5 - perform CRUD operations
// -----------------------------------------------------------------
// get request
responseApp.get('/responses', verifyToken, getResponse);
responseApp.delete('/response/:_id', verifyToken, deleteResponse);

// post request
responseApp.post('/response', addResponse);
// -----------------------------------------------------------------

// step 6 - export the app to server.js
module.exports = responseApp;