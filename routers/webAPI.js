const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

let userController = require('./../controllers/userController');
let itemController = require('./../controllers/itemController');
let adminController = require('./../controllers/adminController');
let config = require('./../config');

async function checkToken(req,res,next){
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if(typeof token !== 'undefined'){
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        // req.token = token;
        jwt.verify(token, config.secretString, (err, decoded) => {
            if (err) {                
                return res.json({statusCode:0, message:'Token is not valid or expired !', todo:'Please login !'});
            } else {
                req.decoded=decoded;
                next();
                //return res.send({text:"protected router !", data:decoded, time:Date.now()})
            }
        });
        // next();       
    }
    else return res.status(403).send({statusCode:0, message:'Auth token is not supplied', todo:'Please login !'});
    
}

router.post('/new', userController.createNew);
router.post('/login',userController.authenticate);
router.post('/forgotpassword',userController.getCode);
router.post('/forgotpassword.newpassword',userController.setNewPass);
router.get('/confirmation/verify-email.:userID',userController.active);
router.get('/confirmation/verify-email/resend-email',userController.reactive)
router.post('/KYC-upload-img',checkToken,userController.KYCVerify);
router.get('/test',itemController.fetchTest);
router.get('/mainpagetest',checkToken,itemController.protectRouter);
//admin
router.get('/admin/dashboard',checkToken,adminController.dashBoard);
router.get('/admin/dashboard/KYC-verify/del-img-all',checkToken,adminController.delAllKYCImg);
//end admin
module.exports = router;