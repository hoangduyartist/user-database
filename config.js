
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer")

module.exports = {
    secretString: 'secret12345',
    HOST : '142.93.253.93',
    PORT : 81,
    sendEmail
}

function sendEmail(toUser, content){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'userservicetraining2019@gmail.com',
            pass: 'userservice'
        }
    });

    let mailOptions = {

        // from: 'userservicetraining2019@gmail.com',
        from: 'napa training 2019',
        to: toUser.email,
        subject: 'Global Traning - Verify email',
        // text: `Hi there, please verify email to active your account. Click link below\nhttp:\/\/localhost:81\/web-api\/confirmation\/verify-email.${newuser._id}\n`
        text: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

