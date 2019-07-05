const mongoose = require("mongoose");
let path = require("path");
let multer = require("multer");

let userService = require('./../services/userService');
let imgService = require('./../services/imgService');
let config = require('./../config');

module.exports = {
    authenticate,
    createNew,
    active,
    reactive,
    KYCVerify,
    getCode,
    setNewPass
    // update
};


//upload image
//save path
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        //   fieldname is name of input on client //myImage  
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    // limits: { fileSize: 100000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: "myImage", maxCount: 2 }]); //name of input on client
//functions

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype || extname) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only!');
    }
}
//end functions


let images = [];
let email = '';

/**
 * @swagger
 * /user/new:
 *   post:
 *     description: Send user-info to server (include username, password, email), then activate account by email
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json    
 *     parameters:
 *       - name: user
 *         description: new user-info
 *         in: body 
 *         required: true
 *         schema:
  *           example: {
  *             "username": "someUser",
  *             "password": "somePassword",
  *             "email": "example@gmail.com"
  *           }
 *     responses:
 *       201:
 *         description: (status:1) New account created
 *       500: 
 *         description: (status:0) Email or username is taken
 */
function createNew(req, res) {
    let newUser = {

        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    userService.create(newUser)
        .then(data => {
            if (data.newuser) {
                return res.status(200).send(data);
            }
            return res.status(500).send(data);
        })
        .catch(err=>res.status(500).send({ statusCode: 0, message: err }))
}

/**
 * @swagger
 * /user/login:
 *   post:
 *     description: authentication
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *       - application/xml
 *       - applocation/formData  
 *       - application/x-www-form-urlencoded   
 *     consumes:
 *       - application/json
 *       - application/xml
 *       - applocation/formData  
 *       - application/x-www-form-urlencoded   
 *     parameters:
 *       - name: user
 *         description: authenticaton
 *         in: body
 *         required: true
  *         schema:
  *           example: {
  *             "username": "someUser",
  *             "password": "somePassword"
  *           }     
 *     responses:
 *       200:
 *         description: (status:1) User found and logged in successfully
 *       401:
 *         description: (status:0) Bad username, not found in db
 *       403:
 *         description: (status:0) Username and password don't match
 */
function authenticate(req, res) {
    //console.log(req.body);
    let username = req.body.username,
        password = req.body.password;
    userService.authenticate({ username, password })
        .then(data => {
            return res.json(data);
        })
        .catch(err=>res.status(500).send({ statusCode: 0, message: err }))
}

/**
 * @swagger
 * /user/confirmation/verify-email.{userID}:
 *   get:
 *     description: Activate account
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userID
 *         description: id of the user to activate
 *         in: path
 *         required: true
 *         type: String
 *     responses:
 *       200:
 *         description: (status:1) Successful
 */
function active(req, res) {
    let userID = req.params.userID;

    userService.activeAccount({ userID })
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err=>res.status(500).send({ statusCode: 0, message: err }))
}

/**
 * @swagger
 * /user/confirmation/verify-email/resend-email:
 *   get:
 *     description: Re-activate account
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: (status:1) Successful, Email resent
 */
function reactive(req, res) {

    userService.reSendEmail()
    .then(data=>res.send(data))
    .catch(err=>res.status(500).send({ statusCode: 0, message: err }))

}

/**
 * @swagger
 * /user/forgotpassword:
 *   post:
 *     description: Send your email to server to get code for changing your password
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json   
 *       - application/x-www-form-urlencoded   
 *     parameters:
 *       - name: user-email
 *         description: get code
 *         in: body
 *         required: true
  *         schema:
  *           example: {
  *             "email": "youremail@gmailcom"
  *           }
 *     responses:
 *       200:
 *         description: (status:1) Email found and send code to your email
 *       401:
 *         description: (status:0) Bad email, not found in db
 */
function getCode(req, res) {
    if (req.body.email == 'undefined')
        return { statusCode: 0, message: "Please input your email." };

    userService.sendCodeToEmail(req.body.email)
        .then(data => res.send(data))
        .catch(err=>res.status(500).send({ statusCode: 0, message: err }))
}
/**
 * @swagger
 * /user/forgotpassword.newpassword:
 *   post:
 *     description: Send your code and new password to server for setting new password
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json     
 *     parameters:
 *       - name: code-and-new-pass
 *         description: set new password
 *         in: body
 *         required: true
  *         schema:
  *           example: {
  *             "code": "youremail@gmailcom",
  *             "newpassword": "newpassword"
  *           }
 *     responses:
 *       200:
 *         description: (status:1) Successful
 *       401:
 *         description: (status:0) Code is wrong or Error occured
 */
function setNewPass(req, res) {
    userService.setNewPass(req.body.code, req.body.newpassword)
        .then(data => res.send(data))
        .catch(err=>res.status(500).send({ statusCode: 0, message: err }))
}

function KYCVerify(req, res) {

    upload(req, res, (err) => {
        // console.log(path);
        if (err) {
            return res.status(406).send(err);
        } else {

            if (!(req.files && req.files.myImage)) {
                return res.status(404).send({ statusCode: 0, messge: 'Error: No File Selected!' });
            } else {
                let KYCimg = [];
                req.files.myImage.map((img, key) => {
                    let newImg = {
                        _id: mongoose.Types.ObjectId(),
                        name: img.filename,
                        path: `uploads/${img.filename}`,
                        userID: req.decoded.userID,
                        kind: "KYC-upload-img"
                    }
                    KYCimg.push(newImg);
                });
                // images.push(imgUI);
                imgService.create(KYCimg)
                    .then(data => {
                        let toUser = { email: "napaad2019@gmail.com" };
                        let content = `Hi admin, You have a KYC-verify request from user ${req.decoded.userID}. `;
                        // Click link below\nhttp:\/\/localhost:81\/web-api\/confirmation\/verify-email.${userInfo._id}\n` 
                        //config.sendEmail(toUser, content);
                        return res.status(200).send(data);
                    })
                    .catch(err=>res.status(500).send({ statusCode: 0, message: err }))

            }
        }
    });

}


