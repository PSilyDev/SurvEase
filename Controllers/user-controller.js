// step 1 - import the User schema from the db
const User = require('../storeUsersDB')

require('dotenv').config()

// import bson
const mongoose = require('mongoose');

// import bcryptjs for hashing the password
const bcryptjs = require('bcryptjs');

// import jsonwebtoken for creating token
const jwt = require('jsonwebtoken');

// controller function for get request
const getUser = async(req, res) => {
    let userList = await User.find()

    res.send({message: "All Users - ", payload: userList})
}


// controller for registering a user
const createUser = async(req, res) => {
    // get data passed by the user
    let userDetails = req.body;
    // check if there's already a user registered with the username
    let checkDupUser = await User.findOne({username: userDetails.username})
    if(checkDupUser !== null){
        return res.send({payload: "Username already exists"})
    }
    else{
        // creating new user
        let userDocument = new User(userDetails)

        // hash the password
        let hashedPassword = await bcryptjs.hash(userDocument.password, 5);

        // update the password with the hashed password
        userDocument.password = hashedPassword;
        //save the userDocument in the database
        let newUser = await userDocument.save()

        res.status(201).send({message: "User created successfully! ", payload: newUser});
    }
}

//controller for login
const loginUser = async(req, res) => {

    // get data passed by the user
    let userDetails = req.body;

    // check if username exists in the database
    let user = await User.findOne({ username: userDetails.username });
    if(user === null){
        return res.send({ payload: "Invalid username!"})
    }
    else{
        // user exists

        // compare password
        let result = await bcryptjs.compare(userDetails.password, user.password);
        // if password not matched
        if(result === false){
            return res.send({ payload: "Invalid password!"});
        }
        else{
            // username, password both correct

            // create signed token
            const signedToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY, {expiresIn: "1d"});

            // after login success
const { password, ...safeUser } = user.toObject();
res.status(201).json({ message: 'login success', token: signedToken, user: safeUser });

        }
    }
}

// controller for get user by username
const getUserByUsername = async(req, res) => {
    
    // console.log('inside getUserByUsername')
    // res.send({message: "inside getuserbyusername"})
    // get username from url parameter
    let {username} = req.params;

    // find user from database
    let user = await User.findOne({username})

    // check if user is found
    if(!user){
        res.send({ message: "User not found in DB"})
    }
    else{
        res.send({ message: "User found", payload: user});
    }
}

// controller for update user
const updateUser = async(req, res) => {
    const userDetails = req.body;
    
    // check if the ID is provided in the request body
    if(!userDetails.id) {
        return res.status(400).send({message: "User Id is required"});
    }

    try{
        let user = await User.findOneAndUpdate({ _id: userDetails.id}, {$set: userDetails}, {new: true})
        // new = true returns the updated object
        if(!user) {
            return res.status(400).send({message: "User not found in DB"})
        }

        res.status(200).send({message: "User modified", payload: user})
    }
    catch(error){
        res.send({message: "Internal server error"});
    }
    
}


// export these controllers to user-api
module.exports = {getUser, createUser, loginUser, getUserByUsername, updateUser};