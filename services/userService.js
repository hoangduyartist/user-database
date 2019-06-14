const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// LocalStorage = require('node-localstorage').LocalStorage;
// LocalStorage = new LocalStorage('./scratch');
// localStorage = require("localStorage");

const User = require('../models/user');
const Token = require('../models/verifyToken');
module.exports = {
    authenticate,
    create

};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username: username })
    if (!user)
        return ({ status: "error", message: 'user-name is incorrect!' })

    if (user && bcrypt.compareSync(password, user.password)) {
        if(user.isVerified == false )
        return {status: "error", message: "your account hasn't been activated."}
        const token = jwt.sign({ id: user._id }, 'secret12345', { expiresIn: '1h' });
        // LocalStorage.setItem("token", JSON.stringify(token));
        return { status: "success", message: "user found!", data: { user: user, token: token } }
    }
    else {
        return { status: "error", message: "Invalid email/password!", data: null };
    }
}

async function create(userParams) {

    // validate
    const userValidate = await User.findOne({ username: userParams.username });

    if (userValidate) {
        return ({ status: "error", message: 'Username or email is already taken' })
    }
    if (!userValidate) {
        if (await User.findOne({ email: userParams.email }))
            return ({ status: "error", message: 'Username or email is already taken' })
    }

    const user = new User({
        _id: userParams._id,
        isVerified: false,
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();
   const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    
    if (newuser) {
        // token.save(function (err) {
        //     if (err) { return res.status(500).send({ msg: err.message }); }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'userservicetraining2019@gmail.com',
                pass: 'userservice'
            }
        });

        var mailOptions = {

            from: 'userservicetraining2019@gmail.com',
            to: newuser.email,
            subject: 'Global Traning - Verify email',
            text: `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:3000\/confirmation\/verify-email.${newuser._id}\n`
                   
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        //end-send-email

        return ({ status: "success", newuser: newuser, message: "Register successful!", todo: `Email sent to ${newuser.email}. Check email to acive your account.` })
    }
    return ({ status: "error", message: "Register failed" })
//})
    
}
