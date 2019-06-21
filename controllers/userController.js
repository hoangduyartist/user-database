const mongoose = require("mongoose");
let path = require("path");
let multer = require("multer");

let userService = require('./../services/userService');


module.exports = {
    authenticate,
    createNew,
    active,
    reactive,
    KYCVerify
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
}).single('myImage'); //name of input on client
//functions

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only!');
    }
}
let images = [];
//end functions

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
            if (req.file == undefined) {
                res.status(404).send({statusCode:0, messge: 'Error: No File Selected!'});
            } else {
                console.log(req.file);
                //UI
                let mongoose = require("mongoose");
                let imgUI = {

                    _id: mongoose.Types.ObjectId(),
                    path: `uploads/${req.file.filename}`,
                    name: req.file.filename,
                    description: req.body.description
                }
                images.push(imgUI);
                return res.send(images);
                //end UI

                //insert in database
                // const user = require('./models/user');
                // let mUser = new user();
                // mUser.fullname=req.body.fullname;
                // mUser.name=req.body.name;
                // mUser.password=req.body.password;
                // mUser.save((e, rs)=>{
                //     if(!e)
                //     //  res.send(rs);
                //     res.render('authenticate', {err: '', isReg:true, regSuccess:true });
                //     else{
                //         console.log(e.message);
                //         res.render('authenticate', {err: e, isReg:true, regSuccess:false });
                //     } 
                // });
            }
        }
    });
    
}

