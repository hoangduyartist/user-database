const mongoose = require("mongoose");

let User = require('../models/user');
let userService = require('./../services/userService');

module.exports = {
    authenticate,
    createNew,
    active
    // update
};

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
    let username = req.body.username,
        password = req.body.password;
    userService.authenticate({ username, password })
        .then(data => {
            res.json(data);
        })
        .catch(err => console.log(err));
}

function active(req, res) {
    let userID = req.params.userID;

    userService.activeAccount({ userID })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => console.log(err));
}
