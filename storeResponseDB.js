const mongoose = require('./db');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: [Schema.Types.Mixed], default: [] } // supports strings, arrays, numbers, etc.
}, { _id: false });

const ResponseSchema = new Schema({
  id: String,
  name: String,
  email: String,
  category_name: String,
  survey_name: String,
  answers: [AnswerSchema]
}, { timestamps: true });

module.exports = mongoose.model('response', ResponseSchema);
