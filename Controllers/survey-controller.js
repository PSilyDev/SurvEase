// Controllers/survey-controller.js

// import the SurveyModel schema from the db
const { default: mongoose } = require("mongoose");
const SurveyModel = require("../storeSurveysDB");
require("dotenv").config();

// ✅ use shared mail helper instead of nodemailer
const { sendEmail: sendMailHelper } = require("../utils/mailer");

let nanoid;
(async () => {
  const mod = await import("nanoid");
  nanoid = mod.nanoid;
})();

// controller function for get request
const getSurveys = async (req, res) => {
  const surveyList = await SurveyModel.find();
  res.send({ message: "All surveys - ", payload: surveyList });
};

const getPublicData = async (req, res) => {
  const surveyList = await SurveyModel.find();
  res.send({ message: "All surveys - ", payload: surveyList });
};

// controller function to add a survey
const addSurvey = async (req, res) => {
  const surveyDetails = req.body;

  const surveyDocument = new SurveyModel(surveyDetails);
  const newSurvey = await surveyDocument.save();

  res.status(201).send({
    message: "Survey added successfully!",
    payload: newSurvey,
  });
};

// controller for updating survey (addToSet)
const updateSurvey = async (req, res) => {
  const surveyDetails = req.body;

  const data = await SurveyModel.updateOne(
    { _id: surveyDetails.category_id },
    { $addToSet: { surveys: surveyDetails.updated_surveys } }
  );

  if (data === null) {
    res.status(200).send({ message: "survey not updated", payload: data });
  } else {
    res.status(200).send({ message: "survey updated", payload: data });
  }
};

// controller for replacing survey
const replaceSurvey = async (req, res) => {
  try {
    const surveyDetails = req.body; // expected: { category_name, ...fields }
    const updatedSurvey = await SurveyModel.updateOne(
      { category_name: surveyDetails.category_name },
      { $set: surveyDetails }
    );
    if (updatedSurvey.matchedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res
      .status(200)
      .json({ message: "Survey updated", payload: updatedSurvey });
  } catch (error) {
    console.error("error replacing survey - ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const publishSurvey = async (req, res) => {
  const { category_name, survey_name } = req.body;
  const shareId = nanoid(10);

  const updated = await SurveyModel.findOneAndUpdate(
    { category_name, "surveys.survey_name": survey_name },
    {
      $set: {
        "surveys.$.published": true,
        "surveys.$.shareId": shareId,
      },
    },
    { new: true }
  );

  if (!updated)
    return res.status(404).send({ message: "Survey not found" });

  res.send({ message: "Survey published", payload: { shareId } });
};

// delete a single survey; delete category doc if it becomes empty
const deleteSurvey = async (req, res) => {
  try {
    const { category_name, survey_name } = req.body;

    if (!category_name || !survey_name) {
      return res
        .status(400)
        .send({ message: "category_name and survey_name are required" });
    }

    const updated = await SurveyModel.findOneAndUpdate(
      { category_name },
      { $pull: { surveys: { survey_name } } },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .send({ message: "Category or survey not found" });
    }

    if (!updated.surveys || updated.surveys.length === 0) {
      await SurveyModel.deleteOne({ _id: updated._id });
      return res.send({
        message: "Survey deleted and empty category removed",
        payload: null,
      });
    }

    return res.send({
      message: "Survey deleted",
      payload: updated,
    });
  } catch (err) {
    console.error("deleteSurvey error:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Frontend origin fallback for link building (for emails)
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// email controller (uses utils/mailer, never hangs)
const sendEmail = async (req, res) => {
  try {
    const { to, subject, category_name, survey_name, link, share } = req.body;

    if (!to) {
      return res
        .status(400)
        .send({ message: "Recipient email (to) is required" });
    }

    const safe = encodeURIComponent;

    const origin =
      link?.startsWith("http") && link
        ? null
        : req.headers.origin ||
          process.env.APP_URL ||
          FRONTEND_ORIGIN;

    const built =
      origin &&
      `${origin}/take/${safe(category_name)}/${safe(survey_name)}${
        share ? `?share=${safe(share)}` : ""
      }`;

    const surveyLink = link || built;

    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 8px">You're invited to a survey</h2>
        <p style="margin:0 0 16px">
          <strong>${category_name}</strong> • <strong>${survey_name}</strong>
        </p>
        <a href="${surveyLink}" 
           style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          Take the survey
        </a>
        <p style="margin:16px 0 0">
          or copy this link:<br/>
          <a href="${surveyLink}">${surveyLink}</a>
        </p>
      </div>
    `;

    // fire-and-forget; Resend will deliver if EMAIL_ENABLED=true
    sendMailHelper({
      to,
      subject: subject || `Survey: ${survey_name}`,
      html,
    });

    res.status(200).send({
      message: "Survey email queued",
      link: surveyLink,
    });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).send({
      message: "Failed to send email",
    });
  }
};

// export controllers to survey-api
module.exports = {
  getSurveys,
  addSurvey,
  updateSurvey,
  replaceSurvey,
  getPublicData,
  sendEmail,
  publishSurvey,
  deleteSurvey,
};
