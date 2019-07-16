const mongoose = require("mongoose");
let path = require("path");
let multer = require("multer");

let userService = require('./../services/userService');
let imgService = require('./../services/imgService');

module.exports = {
    authenticate,
    createNew,
    active,
    reactive,
    KYCVerify,
    getCode,
    setNewPass,
    fetchProfile,
    updateProfile
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

/**
 * @swagger
 * /user/new:
 *   post:
 *     description: Send user-info to server (include username, password, email), then activate account by email
 *     tags:
 *       - user
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
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
}

/**
 * @swagger
 * /user/login:
 *   post:
 *     description: authentication
 *     tags:
 *       - user
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

    let username = req.body.username,
        password = req.body.password;
    userService.authenticate({ username, password })
        .then(data => {
            return res.json(data);
        })
        .catch(err => res.send({ status: 0, message: err }))
}

/**
 * @swagger
 * /user/confirmation/verify-email/{userID}:
 *   get:
 *     description: Activate account
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userID
 *         description: id of the user to activate
 *         in: path
 *         required: true
 *         type: string
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
        .catch(err => res.send({ status: 0, message: err }))
}

/**
 * @swagger
 * /user/confirmation/verify-email/resend-email:
 *   post:
 *     description: Re-activate account
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: body 
 *         required: true
 *         schema:
 *           example: {
 *             "email": "youremail@gmail.com"
 *           }   
 *     responses:
 *       200:
 *         description: (status:1) Successful, Email resent
 */
function reactive(req, res, next) {
    if(typeof (req.body.email) == 'undefined')
    return {status: 0, message: "Please input your email"}
    
    userService.reSendEmail(req.body.email)
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
        // .catch(err => next(err));
}

/**
 * @swagger
 * /user/forgotpassword:
 *   post:
 *     description: Send your email to server to get code for changing your password
 *     tags:
 *       - user
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
  *             "email": "youremail@gmail.com"
  *           }
 *     responses:
 *       200:
 *         description: (status:1) Email found and send code to your email
 *       401:
 *         description: (status:0) Bad email, not found in db
 */
function getCode(req, res) {
    if (typeof (req.body.email) == 'undefined')
        return res.send({ statusCode: 0, message: "Please input your email." });

    userService.sendCodeToEmail(req.body.email)
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
}
/**
 * @swagger
 * /user/forgotpassword/newpassword:
 *   put:
 *     description: Send your code and new password to server for setting new password
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json     
 *     parameters:
 *       - name: codeid
 *         in: header    
 *       - name: code-and-new-pass
 *         description: set new password
 *         in: body
 *         required: true
  *         schema:
  *           example: {
  *             "code": "yourcode",
  *             "newpassword": "newpassword"
  *           }
 *     responses:
 *       200:
 *         description: (status:1) Successful
 *       401:
 *         description: (status:0) Code is wrong or Error occured
 */
function setNewPass(req, res) {
    // let email = req.headers['email'];
    let codeID = req.headers['codeid']; //header name only lower-case

    if(typeof codeID == 'undefined')
    return res.send({status:0 ,message: `Set new password failed (header)` })

    userService.setNewPass(req.body.code, req.body.newpassword, codeID)
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
}

/**
 * @swagger
 * /user/kyc-upload-img:
 *   post:
 *     description: Send your portrait to server for verifying
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data     
 *     parameters:
 *       - name: Authorization
 *         description: your session
 *         in: header
 *         type: string 
 *       - name: myImage
 *         required: true 
 *         description: image
 *         in: formData
 *         type: file 
 *     responses:
 *       200:
 *         description: (status:1) Successful
 *       203:
 *         description: (status:0) Non-authoritative Information
 */
function KYCVerify(req, res, next) {

    upload(req, res, (err) => {
        // console.log(path);
        if (err) {
            next(new Error(err))
            // return res.status(406).send(err);
        } else {
            let userUpload = req.decoded.userID;
            if (!(req.files && req.files.myImage)) {
                return res.status(404).send({ statusCode: 0, messge: 'Error: No File Selected!' });
            } else {
                let KYCimg = [];
                req.files.myImage.map((img, key) => {
                    let newImg = {
                        _id: mongoose.Types.ObjectId(),
                        name: img.filename,
                        path: `uploads/${img.filename}`,
                        userID: userUpload,
                        kind: "KYC-upload-img"
                    }
                    KYCimg.push(newImg);
                });

                imgService.create(KYCimg)
                    .then(data => {
                        return res.status(200).send(data);
                    })
                    .catch(err => res.send({ status: 0, message: err }))
                    // .catch(err => next(err))

            }
        }
    });

}

/**
 * @swagger
 * /user/me/profile:
 *   get:
 *     description: Get your info
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Your session
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: (status:1) Successful
 */
function fetchProfile(req,res){
    if(typeof req.decoded == 'undefined')
    return { status: 0, message: "Non-authoritative Information" }

    userService.fetchProfile(req.decoded.userID)
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
}
/**
 * @swagger
 * /user/me/update-profile:
 *   put:
 *     description: Update profile
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Your session
 *         in: header
 *         required: true
 *         type: string
 *       - name: updated-info
 *         in: body
 *         required: true
 *         schema:
 *          example: {
 *           "fullname": "your-full-name",
 *           "phone": "your-phone-number",
 *           "birthday": "your-day-of-birth"      
 *          }    
 *     responses:
 *       200:
 *         description: (status:1) Successful
 */
function updateProfile(req, res) {
    if(typeof req.decoded == 'undefined')
    return { status: 0, message: "Non-authoritative Information" }

    userService.updateProfile(req.decoded.userID, req.body)
        .then(data => res.send(data))
        .catch(err => res.send({ status: 0, message: err }))
}


