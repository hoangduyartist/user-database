const mongoose = require("mongoose");
let item = require('./../models/item');
let itemService = require('./../services/itemService');

module.exports = {
    // authenticate,
    createNew,
    fetchTest,
    protectRouter
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
function fetchTest(req, res) {

    itemService.fetchTest()
        .then(data => {
            if (data) {
                return res.status(200).send(data);
            }
            return res.status(500).send({ msg: "error" });
        })
        .catch(err => console.log(err));
}
async function protectRouter(req, res) {
    //const jwt = require("jsonwebtoken");
    // const jwtVerify = await jwt.verify(req.token, 'secret12345');
    // if(jwtVerify) return res.json(jwtVerify);
    // return {message: 'Token is not valid or expired'}
    if (typeof req.decoded != 'undefined'){
        return res.send({text:"protected router !", data:req.decoded })
    }
    return res.send({statusCode:0, message: 'Error occurred !'});

}