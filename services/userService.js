const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
let config = require('./../configs/config');

module.exports = {
    authenticate,
    create,
    activeAccount,
    reSendEmail,
    activateKYC,
    sendCodeToEmail,
    setNewPass,
    fetchProfile,
    updateProfile
};

async function authenticate({ username, password }) {

    let hideProp = { code: false, codeID: false, codeExpire: false }
    const user = await User.findOne({ username }, hideProp)
    if (!user)
        return ({ status: 0, message: 'Username is not correct!' })

    if (user && bcrypt.compareSync(password, user.password)) {

        if (user.isVerified == false) {

            return { status: 0, message: "your account hasn't been activated." }
        }

        const token = jwt.sign({ userID: user._id, role: user.role }, config.secretString, { expiresIn: '1d' });

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
    // let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/${config.HOST}:${config.PORT}\/web-api\/user\/confirmation\/verify-email.${newuser._id}\n`;
    let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:4200\/verify-account-email\/${newuser._id}\n`;
    let sendMail = await config.sendEmail(newuser, content);
    //end-send-email

    if (newuser && sendMail) {

        return ({ status: 1, message: "Register successful !", data: { user: user }, todo: { verifyEmail: `An email has been sent to address ${newuser.email}. Please check email to activate your account.` }, email: 'Email sent: ' + sendMail.response })
    }

    return ({ status: 0, message: "Register failed !" })

}
async function reSendEmail(email) {

    let user = await User.findOne({ email });

    if (user) {
        if (user.isVerified == true)
            return ({ status: 0, message: "Your account is already activated." })
        // let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/${config.HOST}:${config.PORT}\/web-api\/user\/confirmation\/verify-email.${user._id}\n`;
        let content = `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:4200\/verify-account-email\/${user._id}\n`;
        let sendEmail = await config.sendEmail(user, content)
        if (sendEmail)
            return ({ status: 1, message: "Email resent", email: 'Email sent: ' + sendEmail.response });

    }
    return ({ status: 0, message: "User not found" })
    // throw new Error('Not found user');
}

async function activeAccount({ userID }) {
    const user = await User.findById(userID);
    if (user) {
        if (user.isVerified == true)
            return ({ status: 0, message: "Your account is already activated." })
    }
    const activeAcc = await User.findByIdAndUpdate(userID, { isVerified: true });
    if (activeAcc) {
        return ({ status: 1, message: "Your account is activated." })
    }

    return ({ status: 0, message: "error occurred" })

}

async function activateKYC(userID) {
    const KYCuser = await User.findByIdAndUpdate(userID, { isKYCVerified: true })

    if (KYCuser)
        return { status: 1, message: "Activate KYC verify successful for user " + KYCuser.username }

    return ({ status: 0, message: "Activate KYC verify failed or error occurred" })
}

//forgot pass
async function sendCodeToEmail(email) {
    const user = await User.findOne({ email });
    if (user) {
        if (user.isVerified == false)
            return { status: 0, message: `Email not found or Not verified` }

        let code = Math.floor(100000 + Math.random() * 900000);

        let content = `Get this code to update your password. Do not share this code for any body !\nYour code is ${code}`
        let sendEmail = await config.sendEmail(user, content);

        if (sendEmail) {
            let resetPass = {
                code,
                codeID: Date.now(),
                codeExpire: Date.now() + 120000
            }

            await User.findOneAndUpdate({ email: email }, resetPass)
            return { status: 1, message: `Verify email sent to ${user.email}, check your email to get code.`, data: { codeID: resetPass.codeID } }
        }

    }
    return { status: 0, message: `Email not found or Error occured` }
}

async function setNewPass(codeInput, newPass, codeID) {

    usercode = await User.findOne({ codeID, codeExpire: { $gt: Date.now() } })
    if (!usercode)
        return { status: 0, message: "Your code is expired" }

    if (codeInput == usercode.code) {
        let expire = {
            password: bcrypt.hashSync(newPass, 10),
            code: null,
            codeID: null,
            codeExpire: null
        }
        const user = await User.findOneAndUpdate({ email: usercode.email }, expire);
        if (user)
            return { status: 1, message: `Set new password successful` }
    }
    return { status: 0, message: "Your code is wrong or expired" }

}
//end forgot pass

async function fetchProfile(userID) {
    const profile = await User.findById(userID)
    if (profile)
        return { status: 1, message: "Fetch profile successful", data: profile }

    return { status: 0, message: "Fetch profile failed or Error occured" }
}

async function updateProfile(userID, profile) {
    const newInfo = await User.findByIdAndUpdate(userID, { profile: profile }, { new: true })
    if (newInfo)
        return ({ status: 1, newinfo: newInfo, message: "Update profile successful" })

    return ({ status: 0, message: "Error occured" })
} 