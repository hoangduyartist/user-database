const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
let config = require('./../configs/config');
let userInfo = '';

module.exports = {
    authenticate,
    create,
    activeAccount,
    reSendEmail,
    sendCodeToEmail,
    setNewPass,
    updateProfile
};

async function authenticate({ username, password }) {

    const user = await User.findOne({ username })
    if (!user)
        return ({ status: 0, message: 'Username is not correct!' })
        
    if (user && bcrypt.compareSync(password, user.password)) {
        userInfo = user;
        if (user.isVerified == false) {

            return { status: 0, message: "your account hasn't been activated." }
        }

        const token = jwt.sign({ userID: user._id, role: user.role }, config.secretString, { expiresIn: '1d' });
        userInfo = user;

        return { status: 1, message: "Successfully logged in!", data: { user: user, token: token } }

    }
    else {
        return { status: 0, message: "Password is not correct!", data: null };
    }
}

async function create(userParams) {

    // validate unique user and email
    const userValidate = await User.findOne({ username: userParams.username });

    if (userValidate) {
        return ({ status: 0, message: 'Username is already taken' })
    }
    if (!userValidate) {
        if (await User.findOne({ email: userParams.email }))
            return ({ status: 0, message: 'Email is already taken' })
    }

    const user = new User({
        _id: userParams._id,
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();

    //send email
    let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/${config.HOST}:${config.PORT}\/web-api\/user\/confirmation\/verify-email.${newuser._id}\n`;
    let sendMail = await config.sendEmail(newuser, content);
    //end-send-email

    if (newuser && sendMail) {
        userInfo = newuser;
        return ({ status: 1, newuser: newuser, message: "Register successful !", todo: { verifyEmail: `An email has been sent to address ${newuser.email}. Please check email to activate your account.` }, email: 'Email sent: ' + sendMail.response })
    }   

    return ({ status: 0, message: "Register failed !" })

}
async function reSendEmail(email) {

    let user = await User.findOne({email});

    if (user) {
        if (user.isVerified == true)
            return ({ status: 0, message: "Your account is already activated."})
        
        let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/${config.HOST}:${config.PORT}\/web-api\/user\/confirmation\/verify-email.${userInfo._id}\n`;
        let sendEmail = await config.sendEmail(email, content);
        if(sendEmail)
        return ({ status: 1, message: "Email resent !", email: 'Email sent: '+sendMail.info });
    } else {
        throw new Error('Not found user');
    }

}

async function activeAccount({ userID }) {
    const user = await User.findById(userID);
    if (user) {
        if (user.isVerified == true)
            return ({ status: 0, message: "Your account is already activated." })
    }
    const activeAcc = await User.findByIdAndUpdate(userID, { isVerified: true });
    if (activeAcc){
        return ({ status: 1, message: "Your account is activated." })
    }

    return ({ status: 0, message: "error occurred !" })

}
//forgot pass
let emailToChangePass = '';
let codeForChangePass = 0;
async function sendCodeToEmail(email) {
    const user = await User.findOne({ email });
    if (user) {
        if(user.isVerified == false)
        return { status: 0, message: `Email not found or Error occured`, email : 'Email sent: '+sendMail.info }

        let code = Math.floor(100000 + Math.random() * 900000);

        let content = `Get this code to update your password. Do not share this code for any body !\nYour code is ${code}`
        let sendEmail = await config.sendEmail(user, content);
        if(sendEmail)
        return { status: 1, message: `Verify email sent to ${user.email}, check your email to get code.`, code: code, email: email }
    }
    return { status: 0, message: `Email not found or Error occured` }
}

async function setNewPass(codeInput, newPass, header) {
    //console.log(code + "  "+ codeForChangePass);
    async function changePass() {
        if (codeInput == header.code) {
            const user = await User.findOneAndUpdate({ email: header.email }, { password: newPass });
            if (user)
                return { status: 1, message: `Set new password successful` }
        }
        return { status: 0, message: "Your code is wrong" }
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
    return bcrypt.hash(newPass, 10)
        .then(hash => {
            newPass = hash;
            // return new Promise(resolve=>{changePass().then(data=>resolve(data))})
            return changePass()
        })
        // .then(data=>data)
        .catch(e => console.log(e))
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

async function updateProfile(userID, profile){
    const newInfo = await User.findByIdAndUpdate(userID, {profile:profile}, {new: true})
    if(newInfo)
    return ({status: 1, newinfo: newInfo, message: "Update profile successful"})
    
    return ({status: 0, message: "Error occured"})
} 