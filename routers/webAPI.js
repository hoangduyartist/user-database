const express = require("express");
const router = express.Router();

let userController = require('./../controllers/userController');
let itemController = require('./../controllers/itemController');

router.post('/new', userController.createNew);
router.post('/login',userController.authenticate);
router.get('/confirmation/verify-email.:userID',userController.active);
router.post('/KYC-upload-img',userController.KYCVerify);
router.get('/test',itemController.fetchTest)

module.exports = router;