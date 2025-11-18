const mongoose = require('./db');
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, required: [true, 'first name is not entered'] },
  last_name: { type: String },
  username: { type: String, required: [true, 'username is not entered'], minLength: [4, 'minimum username should be of 4 characters'] },
  email:    { type: String, required: [true, 'email is required'] },
  password: { type: String, required: [true, 'password is not enetered'] }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
