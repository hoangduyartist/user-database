const express = require("express");
const router = express.Router();

let userController = require('./../controllers/userController');

router.post('/new', userController.createNew);
router.post('/login',userController.authenticate);
router.get(`/confirmation/${newuser._id}`, userController.confirmationEmail);
module.exports = router;