const express = require("express");
const router = express.Router();

let userController = require('./../controllers/userController');
let itemController = require('./../controllers/itemController');
let adminController = require('./../controllers/adminController');
let swaggerController = require('./../controllers/swaggerController');
let config = require('./../configs/config');

const jwt = require("jsonwebtoken");

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
    else return res.send({statusCode:0, message:'Auth token is not supplied', todo:'Please login !'});
    
}



//swagger
router.use('/docs',swaggerController.swaggerUI.serve,swaggerController.swaggerUI.setup(swaggerController.swaggerSpec));
router.get('/json',swaggerController.getJson)
//end swagger

router.post('/user/new', userController.createNew);
router.post('/user/login',userController.authenticate);
router.post('/user/forgotpassword',userController.getCode);
router.put('/user/forgotpassword/newpassword',userController.setNewPass);
router.get('/user/confirmation/verify-email/:userID',userController.active);
router.post('/user/confirmation/verify-email/resend-email',userController.reactive)
router.post('/user/kyc-upload-img', checkToken, userController.KYCVerify);
router.get('/user/me/profile', checkToken, userController.fetchProfile);
router.put('/user/me/update-profile', checkToken, userController.updateProfile);

//admin
// router.get('/admin/dashboard',checkToken,adminController.dashBoard);
router.get('/admin/dashboard/kyc-verify', checkToken, adminController.showKYCImg)
router.get('/admin/dashboard/kyc-verify/:userID', checkToken, adminController.showOwnerKYCImg);
router.get('/admin/dashboard/kyc-verify/confirm/:userID', checkToken, adminController.activateKYC);
router.delete('/admin/dashboard/kyc-verify/del-img-all', checkToken, adminController.delAllKYCImg);
//end admin

//test
router.get('/test',itemController.fetchTest);
router.get('/test/:testID', itemController.fetchTestWithID);
router.post('/test/new', itemController.postTest);
router.delete('/test/delete/:testID', itemController.deleteWithID);
router.delete('/test/delete-all', checkToken, itemController.deleteAll);
router.get('/mainpagetest',checkToken,itemController.protectRouter);
// test

module.exports = router;