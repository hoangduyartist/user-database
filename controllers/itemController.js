const mongoose = require("mongoose");
let item = require('./../models/item');
let itemService = require('./../services/itemService');

module.exports = {
    // authenticate,
    createNew
    // update
};

function createNew(req, res) {
    let newItem = new item({
        _id: new mongoose.Types.ObjectId(),
        fullname: req.body.fullname,
        name: req.body.name,
    })
    itemService.create(newItem)
        .then(data => {
            if (data) {
                return res.status(200).send(newItem);
                // return ({newItem: newItem1})
            }
            return res.status(500).send({ msg: "error" });
        })
        .catch(err => console.log(err));
}