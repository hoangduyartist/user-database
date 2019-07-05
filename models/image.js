
var mongoose = require("mongoose");

/**
 * @swagger
 * definitions:
 *   IMAGE:
 *     type: object
 *     required:
 *       - _id
 *       - name
 *       - path
 *       - userID
 *       - kind
 *     properties:
 *       _id: 
 *         type: objectID
 *       name:
 *         type: string
 *       path:
 *         type: string
 *       description:
 *         type: string
 *       userID: 
 *         type: objectID
 *       kind: 
 *         type: string
 */

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