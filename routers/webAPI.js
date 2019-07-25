const express = require("express");
const router = express.Router();

let userController = require('./../controllers/userController');
let itemController = require('./../controllers/itemController');
let adminController = require('./../controllers/adminController');
let swaggerController = require('./../controllers/swaggerController');
let middleWare = require('./../middlewares/middleware');

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
router.post('/user/kyc-upload-img', middleWare.checkToken, userController.KYCVerify);
router.get('/user/kyc-verify/fetch-with-id', middleWare.checkToken, userController.KYCFetchWithID)
router.get('/user/me/profile', middleWare.checkToken, userController.fetchProfile);
router.put('/user/me/update-profile', middleWare.checkToken, userController.updateProfile);

//admin
// router.get('/admin/dashboard',checkToken,adminController.dashBoard);
router.get('/admin/dashboard/kyc-verify', middleWare.checkToken, adminController.showKYCImg)
router.get('/admin/dashboard/kyc-verify/:userID', middleWare.checkToken, adminController.showOwnerKYCImg);
router.get('/admin/dashboard/kyc-verify/confirm/:userID', middleWare.checkToken, adminController.activateKYC);
router.delete('/admin/dashboard/kyc-verify/del-img-all', middleWare.checkToken, adminController.delAllKYCImg);
//end admin

//test
router.get('/test',itemController.fetchTest);
router.get('/test/:testID', itemController.fetchTestWithID);
router.post('/test/new', itemController.postTest);
router.delete('/test/delete/:testID', itemController.deleteWithID);
router.delete('/test/delete-all', middleWare.checkToken, itemController.deleteAll);
router.get('/mainpagetest',middleWare.checkToken,itemController.protectRouter);
// test

module.exports = router;