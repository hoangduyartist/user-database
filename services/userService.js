const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');
let config = require('./../config');
let userInfo = '';

module.exports = {
    authenticate,
    create,
    activeAccount,
    reSendEmail,
    sendCodeToEmail,
    setNewPass
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username })
    if (!user)
        return ({ statusCode: 0, message: 'Username is not correct!' })

    if (user && bcrypt.compareSync(password, user.password)) {

        if(user.isVerified == false ){
            userInfo = user;
            return { statusCode: 0, message: "your account hasn't been activated." }
        }
        
        const token = jwt.sign({ userID: user._id }, config.secretString, { expiresIn: '1d' });
        userInfo = user;
        //return { statusCode: 1, message: "user found!", data: { user: user, token: token } }
        return { statusCode: 1, message: "Successfully logged in!", data: { user: user, token: token } }

    }
    else {
        return { statusCode: 0, message: "Password is not correct!", data: null };
    }
}

async function create(userParams) {

    // validate unique user and email
    const userValidate = await User.findOne({ username: userParams.username });

    if (userValidate) {
        return ({ statusCode: 0, message: 'Username is already taken' })
    }
    if (!userValidate) {
        if (await User.findOne({ email: userParams.email }))
            return ({ statusCode: 0, message: 'Email is already taken' })
        //return ({ statusCode: 0, message: 'Username or email is already taken'})
    }

    const user = new User({
        _id: userParams._id,
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();

    if (newuser) {
        //send email
        let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/142.93.253.93:81\/web-api\/confirmation\/verify-email.${newuser._id}\n`;
        config.sendEmail(newuser, content);
        userInfo = newuser;
        //end-send-email

        return ({ statusCode: 1, newuser: newuser, message: "Register successful !", todo: {verifyEmail:`An email has been sent to address ${newuser.email}. Please check email to activate your account.`} })
    }

    return ({ statusCode: 0, message: "Register failed !" })

}
function reSendEmail() {
    let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/142.93.253.93:81\/web-api\/confirmation\/verify-email.${userInfo._id}\n`;
    config.sendEmail(userInfo, content);
}

async function activeAccount({ userID }) {
    const user = await User.findById(userID);
    if (user) {
        if (user.isVerified == true)
            return ({ statusCode: 1, message: "Your account is already activated." })
    }
    const activeAcc = await User.findByIdAndUpdate(userID, { isVerified: true });
    if (activeAcc)
        return ({ statusCode: 1, message: "Your account is activated." })


    return ({ statusCode: 0, message: "error occurred !" })

}
//forgot pass
let emailToChangePass = '';
let codeForChangePass = 0;
async function sendCodeToEmail(email) {
    const user = await User.findOne({ email });
    if (user) {

        let code = Math.floor(100000 + Math.random() * 900000);
        codeForChangePass = code;
        emailToChangePass = user.email;
        let content = `Get this code to update your password. Do not share this code for any body !\nYour code is ${code}`
        config.sendEmail(user, content);
        return { statusCode: 1, message: `Verify email sent to ${user.email}, check your email to get code.` }
    }
    return { statusCode: 0, message: `Email not found` }
}

async function setNewPass(code, newPass) {
    //console.log(code + "  "+ codeForChangePass);
    async function changePass() {
        if (code == codeForChangePass) {
            const user = await User.findOneAndUpdate({ email: emailToChangePass }, { password: newPass });
            if (user)
                return { statusCode: 1, message: `Set new password successful` }
        }
        return { statusCode: 0, message: "Your code is wrong" }
    }

    const bcrypt = require("bcrypt");
// c1    
    // return new Promise((resolve)=>{
    //     bcrypt.hash(newPass, 10,async function (err, hash) {
    //         if (err)
    //             return { statusCode: 0, message: "Hash failed" }
    
    //         newPass = hash;
    //         // res(changePass().then(data));
    //         changePass().then(data => resolve(data));

    //     })
    // })
// c2    
    return bcrypt.hash(newPass,10)
    .then(hash=>{
        newPass = hash;
        // return new Promise(resolve=>{changePass().then(data=>resolve(data))})
        return changePass()
    })
    // .then(data=>data)
    .catch(e=>console.log(e))
// c3
    // try{
    //     let afterhash = await bcrypt.hash(newPass,10)
    //     if(afterhash){
    //         newPass = afterhash;
    //         let data = await changePass()
    //         return data;
    //     }
    // }catch(err){console.log(err)}
}
 //end forgot pass