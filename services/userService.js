const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// LocalStorage = require('node-localstorage').LocalStorage;
// LocalStorage = new LocalStorage('./scratch');
// localStorage = require("localStorage");

const User = require('../models/user');

module.exports = {
    authenticate,
    create

};

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
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();
    if (newuser) {
        // var nodemailer = require('nodemailer');
        //send-email
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'userservicetraining2019@gmail.com',
                pass: 'userservice'
            }
        });

        var mailOptions = {
            from: 'nguyenhoangduy19598@gmail.com',
            to: 'hoangduy.artist@gmail.com, hotuanvu1234@gmail.com, thienngan12796@gmail.com',
            subject: 'Sending Email using Node.js',
            text: `nodejs-send-email.`
            // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        //end-send-email
        return ({ status: "success", newuser: newuser, message: "Register successful!" })
    }

    return ({ status: "error", message: "Register failed" })

}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username: username })
    if (!user)
        return ({ status: "error", message: 'user-name is incorrect!' })

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'secret12345', { expiresIn: '1h' });
        // LocalStorage.setItem("token", JSON.stringify(token));
        return { status: "success", message: "user found!", data: { user: user, token: token } }
    }
    else {
        return { status: "error", message: "Invalid email/password!", data: null };
    }
}
// async function update(usrID,userParams){
//     let updatedUsr = await User.findByIdAndUpdate(usrID,userParams);
//     if (updatedUsr)
//     return ({updatedUser:updatedUsr,msg:'Update successful !'})
//     return ({msg:'Register failed !'})
// } 
