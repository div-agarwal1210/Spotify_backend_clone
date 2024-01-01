const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const {getToken} = require("../utils/Helpers");

router.post("/register", async(req,res)=>{
    // will run when register api is called as post.
    const {email, password, firstName, lastName, username} = req.body;

    // Does user with this email already exit? If yes we will throwh an error
    const user = await User.findOne({email:email});
    if(user) {
        return res.status(403).json({error:"A user with this email already exits"});
    }
    // Create new User
    // Should not store passwords in plane text.
    //We convert plain text to a hash.
    const hashPassword = await bcrypt.hash(password, 10);
    const newUserData ={email, password: hashPassword, firstName, lastName, username};
    const newUser = await User.create(newUserData);

    //create token to user
    const token = await getToken(email , newUser);

    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});
router.post("/login", async(req,res)=>{
    //get email aand pass from get
    const {email,password}=req.body;
    //check user. if not credentials are invalid
    const user = await User.findOne({email:email})
    if(!user){
        return res.status(403).json({error:"Invalid Credentials"});
    }
    // user exists, check passwordi scooerct or not credebtials wrong

    //bcrypt.compare enabled to compare 1 password in plaintext to hash password securly
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(403).json({error:"Invalid Credentials"});
    }

    //if credentials are cirrect , return token
    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
})
module.exports = router;