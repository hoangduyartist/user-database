const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// LocalStorage = require('node-localstorage').LocalStorage;
// LocalStorage = new LocalStorage('./scratch');
// localStorage = require("localStorage");

const User = require('../models/user');
let config = require('./../config');
let userInfo = '';

module.exports = {
    authenticate,
    create,
    activeAccount,
    reSendEmail
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username })
    if (!user)
        return ({ statusCode: 0, message: 'user-name is incorrect!' })

    if (user && bcrypt.compareSync(password, user.password)) {
        if(user.isVerified == false ){
            userInfo = user;
            return {statusCode: 0, message: "your account hasn't been activated."}
        }
        
        const token = jwt.sign({ userID: user._id }, config.secretString, { expiresIn: '30s' });
        userInfo = user;
        // LocalStorage.setItem("token", JSON.stringify(token));
        return { statusCode: 1, message: "user found!", data: { user: user, token: token } }
    }
    else {
        return { statusCode: 0, message: "Password is incorrect !", data: null };
    }
}

async function create(userParams) {

    // validate unique user and email
    const userValidate = await User.findOne({ username: userParams.username });

    if (userValidate) {
        return ({ statusCode: 0, message: 'Username or email is already taken' })
    }
    if (!userValidate) {
        if (await User.findOne({ email: userParams.email }))
            return ({ statusCode: 1, message: 'Username or email is already taken' })
    }

    const user = new User({
        _id: userParams._id,
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();
    
    if (newuser) {
        // token.save(function (err) {
        //     if (err) { return res.status(500).send({ msg: err.message }); }
        //send email
        let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:81\/web-api\/confirmation\/verify-email.${newuser._id}\n`;
        config.sendEmail(newuser, content);
        userInfo = newuser;
        //end-send-email

        return ({ statusCode: 1, newuser: newuser, message: "Register successful !", todo: {verifyEmail:`Email sent to ${newuser.email}. Check email to active your account.`} })
    }
    return ({ statusCode: 0, message: "Register failed !" })

}
function reSendEmail(){
    let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:81\/web-api\/confirmation\/verify-email.${userInfo._id}\n`;
    config.sendEmail(userInfo,content);
    // sendVerifyEmail(userInfo);
}

async function activeAccount({userID}){
    const user = await User.findById(userID);
    if(user){
        if(user.isVerified == true)
        return ({ statusCode: 1, message: "Your account is already activated." })
    }
    const activeAcc = await User.findByIdAndUpdate(userID,{isVerified:true});
    if(activeAcc)
    return ({ statusCode: 1, message: "Your account is activated." })

    return ({ statusCode: 0, message: "error occurred !" })
}
