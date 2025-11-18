const mongoose = require('./db');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  id: Number,
  text: String,
  type: String,
  options: { type: [String], default: [] }
}, { _id: false });

const SurveysSchema = new mongoose.Schema({
  survey_name: String,
  questions: [QuestionSchema],
  published: { type: Boolean, default: false },
  shareId: { type: String, default: null }
});

const StoreSurveysSchema = new Schema({
  category_name: { type: String, required: true },
  surveys: { type: [SurveysSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('survey', StoreSurveysSchema);
