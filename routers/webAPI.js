const express = require("express");
const router = express.Router();
let cors = require("cors");
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

let userController = require('./../controllers/userController');
let itemController = require('./../controllers/itemController');

router.post('/new', userController.createNew);
router.post('/login',cors(corsOptions),userController.authenticate);
router.get('/confirmation/verify-email.:userID',userController.active);

router.get('/confirmation/verify-email/resend-email',userController.reactive)
router.post('/KYC-upload-img',userController.KYCVerify);
router.get('/test',itemController.fetchTest)

module.exports = router;