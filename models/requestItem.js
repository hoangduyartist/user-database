
var mongoose = require("mongoose");
const reqItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true,
        // unique: true
    },
    method: {
        type: String,
        required: true,
        // unique: true
    },
    endpoint: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        // minlength : [4, 'at least 4 char']
    },
    return : []

});

module.exports = mongoose.model("requestItems",reqItemSchema) ;