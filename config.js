
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");

let HOST = process.env.HOST || "localhost";
let PORT = process.env.PORT || 81;

async function sendEmail(toUser, content){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'userservicetraining2019@gmail.com',
            pass: 'userservice'
        }
    });

    let mailOptions = {

        from: 'napa training 2019',
        to: toUser.email,
        subject: 'Global Traning - Verify email',
        text: content
    };

    return transporter.sendMail(mailOptions);

}

module.exports = {
    secretString: 'secret12345',
    HOST,
    PORT,
    sendEmail
}