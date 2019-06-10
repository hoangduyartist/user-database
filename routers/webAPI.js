const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// let item = require('./../models/item');
// let itemService = require('./../services/itemService');
let itemController = require('./../controllers/itemController');

// router.post('/new', (req, res) => {
//     let newItem = new item({
//         _id: new mongoose.Types.ObjectId(),
//         fullname: req.body.fullname,
//         name: req.body.name,
//     })
//     itemService.create(newItem)
//         .then(data => {
//             if (newItem.save()) {
//                 return res.status(200).send(newItem);
//                 // return ({newItem: newItem1})
//             }
//             return res.status(500).send({ msg: "error" });
//         })
//         .catch(err => console.log(err));
// })

router.post('/new', itemController.createNew);

module.exports = router;