// var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true,
        // unique: true
    },
    contacts : [],
    friends : Array
});

module.exports = mongoose.model("items",itemSchema) ;