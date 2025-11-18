// APIs/survey-api.js

// step 1 - define express router
const exp = require("express");
const surveyApp = exp.Router();

// step 3 - define express-async-handler
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("../Middlewares/verifyToken");

// step 4 - import controller functions from the survey-controller
const {
  getSurveys,
  addSurvey,
  updateSurvey,
  replaceSurvey,
  getPublicData,
  sendEmail,
  publishSurvey,
  deleteSurvey,
} = require("../Controllers/survey-controller");

// step 5 - perform CRUD operations
// --------------------------------------------------------------------

// get all surveys (protected)
surveyApp.get("/surveys", verifyToken, expressAsyncHandler(getSurveys));

// public api (no auth)
surveyApp.get("/public", expressAsyncHandler(getPublicData));

// create survey (you can add verifyToken here if you want only logged-in users)
surveyApp.post("/survey", expressAsyncHandler(addSurvey));

// update survey (protected)
surveyApp.put("/survey", verifyToken, expressAsyncHandler(updateSurvey));

// replace survey (protected)
surveyApp.put(
  "/replaceSurvey",
  verifyToken,
  expressAsyncHandler(replaceSurvey)
);

// publish survey (protected)
surveyApp.put("/publish", verifyToken, expressAsyncHandler(publishSurvey));

// send survey via email (protected)
surveyApp.post("/sendEmail", verifyToken, expressAsyncHandler(sendEmail));

// delete a survey (and drop category if empty) (protected)
surveyApp.delete("/survey", verifyToken, expressAsyncHandler(deleteSurvey));

// --------------------------------------------------------------------

// step 6 - export the surveyApp to server.js
module.exports = surveyApp;
