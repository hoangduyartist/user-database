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
}).fields([{name:"myImage", maxCount:2}]); //name of input on client
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
        .catch(err => console.log(err));
}

function authenticate(req, res) {
    console.log(req.body);
    let username = req.body.username,
        password = req.body.password;
    userService.authenticate({ username, password })
        .then(data => {
            return res.json(data);
        })
        .catch(err => console.log(err));
}

function active(req, res) {
    let userID = req.params.userID;

    userService.activeAccount({ userID })
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => console.log(err));
}
function reactive(req, res) {

    userService.reSendEmail()
    return res.status(202).send("Email resent !");

}

function KYCVerify(req, res) {

    upload(req, res, (err) => {
        // console.log(path);
        if (err) {
            return res.status(406).send(err);
        } else {

            if (!(req.files && req.files.myImage)) {
                return res.status(404).send({statusCode:0, messge: 'Error: No File Selected!'});
            } else {
                let KYCimg = [];
                req.files.myImage.map((img,key)=>{
                    let newImg = {
                        _id: mongoose.Types.ObjectId(),
                        name: img.filename,
                        path: `uploads/${img.filename}`,  
                        userID: req.decoded.userID,
                        kind:"KYC-upload-img"                              
                    }
                    KYCimg.push(newImg);
                });
                // images.push(imgUI);
                imgService.create(KYCimg)
                .then(data=>{
                    let toUser = {email: "napaad2019@gmail.com"};
                    let content = `Hi admin, You have a KYC-verify request from user ${req.decoded.userID}. `;
                    // Click link below\nhttp:\/\/localhost:81\/web-api\/confirmation\/verify-email.${userInfo._id}\n` 
                    //config.sendEmail(toUser, content);
                    return res.status(200).send(data);
                })
                .catch(e=>res.send(e))

            }
        }
    });
    
}

function getCode(req,res){
    if(req.body.email == 'undefined')
    return {statusCode: 0, message: "Please input your email."};

    userService.sendCodeToEmail(req.body.email)
    .then(data=>res.send(data))
    .catch()
}
function setNewPass(req,res){
    userService.setNewPass(req.body.code,req.body.newpassword)
    .then(data=>res.send(data))
    .catch(err=>res.send(err))
}
