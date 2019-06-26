
var mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "Description for image"
    }

});

module.exports = mongoose.model("images",imageSchema) ;