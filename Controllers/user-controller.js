// Controllers/user-controller.js

// step 1 - import the User schema from the db
const User = require("../storeUsersDB");

require("dotenv").config();

// import bson / mongoose (if you need it elsewhere)
const mongoose = require("mongoose");

// import bcryptjs for hashing the password
const bcryptjs = require("bcryptjs");

// import jsonwebtoken for creating token
const jwt = require("jsonwebtoken");

// ✅ import mail helper (now backed by Resend HTTP API)
const { sendSignupEmail } = require("../utils/mailer");

// controller function for get request
const getUser = async (req, res) => {
  const userList = await User.find();
  res.send({ message: "All Users - ", payload: userList });
};

// controller for registering a user
const createUser = async (req, res) => {
  // get data passed by the user
  const userDetails = req.body;

  // check if there's already a user registered with the username
  const checkDupUser = await User.findOne({ username: userDetails.username });

  if (checkDupUser !== null) {
    // use 400 so frontend can treat it as an error
    return res
      .status(400)
      .send({ payload: "Username already exists" });
  }

  // create new user document
  const userDocument = new User(userDetails);

  // hash the password
  const hashedPassword = await bcryptjs.hash(userDocument.password, 5);

  // update the password with the hashed password
  userDocument.password = hashedPassword;

  // save the userDocument in the database
  const newUser = await userDocument.save();

  // ✅ fire-and-forget welcome email (Resend will handle it)
  try {
    sendSignupEmail({
      to: newUser.email,
      subject: "Welcome to SurvEase",
      text: `Hi ${
        newUser.first_name || newUser.username
      },\n\nThanks for signing up for SurvEase!`,
    });
  } catch (err) {
    console.error("sendSignupEmail error (ignored):", err.message);
  }

  // return 201 for successful creation (frontend expects this)
  res
    .status(201)
    .send({ message: "User created successfully! ", payload: newUser });
};

// controller for login
const loginUser = async (req, res) => {
  // get data passed by the user
  const userDetails = req.body;

  // check if username exists in the database
  const user = await User.findOne({ username: userDetails.username });

  if (user === null) {
    // invalid username
    return res.status(400).send({ payload: "Invalid username!" });
  }

  // user exists → compare password
  const result = await bcryptjs.compare(userDetails.password, user.password);

  if (result === false) {
    // invalid password
    return res.status(400).send({ payload: "Invalid password!" });
  }

  // username & password both correct → create signed token
  const signedToken = jwt.sign(
    { username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  // remove password before sending back to client
  const { password, ...safeUser } = user.toObject();

  // 201 to match your current frontend expectations
  res
    .status(201)
    .json({ message: "login success", token: signedToken, user: safeUser });
};

// controller for get user by username
const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    return res.send({ message: "User not found in DB" });
  }

  res.send({ message: "User found", payload: user });
};

// controller for update user
const updateUser = async (req, res) => {
  const userDetails = req.body;

  if (!userDetails.id) {
    return res.status(400).send({ message: "User Id is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userDetails.id },
      { $set: userDetails },
      { new: true }
    );

    if (!user) {
      return res.status(400).send({ message: "User not found in DB" });
    }

    res.status(200).send({ message: "User modified", payload: user });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// export these controllers to user-api
module.exports = {
  getUser,
  createUser,
  loginUser,
  getUserByUsername,
  updateUser,
};
