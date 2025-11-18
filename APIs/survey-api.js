//  step 1- define express router
const exp = require('express')
const { 
  getSurveys,
  addSurvey,
  updateSurvey,
  replaceSurvey,
  getPublicData,
  sendEmail,
  publishSurvey,
  deleteSurvey,       // 👈 import here
} = require('../Controllers/survey-controller');

// ...
const surveyApp = exp.Router();
const expressAsyncHandler = require('express-async-handler')

const verifyToken = require('../Middlewares/verifyToken')
// publish survey
surveyApp.put("/publish", verifyToken, publishSurvey);

// delete survey
surveyApp.delete("/survey", verifyToken, deleteSurvey);   // 👈 new route

surveyApp.post('/sendEmail', verifyToken, sendEmail);


// step 2 - create a route(mini-express app)


// step 3 - define express-async-handler


// step 4 - import controller functions from the survey-controller

// step 5 - perform CRUD operations
// --------------------------------------------------------------------
// get request
surveyApp.get('/surveys', verifyToken, getSurveys)

// public api
surveyApp.get('/public', getPublicData)

//post surveys
surveyApp.post('/survey', addSurvey)

// put request
surveyApp.put('/survey', verifyToken, updateSurvey)

// put request to replace
surveyApp.put('/replaceSurvey', replaceSurvey)

// publish survey
surveyApp.put("/publish", verifyToken, publishSurvey);

surveyApp.post('/sendEmail', verifyToken, sendEmail)


// delete a survey (and drop category if empty)
// APIs/survey-api.js
surveyApp.delete("/survey", verifyToken, deleteSurvey);


// --------------------------------------------------------------------

// step 6 - export the surveyApp to server.js
module.exports = surveyApp;