var bcrypt = require('bcrypt');
var mongoose = require("mongoose");

/**
 * @swagger
 * definitions:
 *   USER:
 *     type: object
 *     required:
 *       - _id
 *       - username
 *       - password
 *       - email 
 *       - role
 *     properties:
 *       _id: 
 *         type: objectID
 *       username:
 *         type: string
 *       password:
 *         type: password
 *       email:
 *         type: email
 *       isVerified:
 *         type: boolean
 *       isKYCVerified: 
 *         type: boolean
 *       role: 
 *         type: string
 */

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    username: {
        type: String,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isKYCVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true,
        // minlength : [4, 'at least 4 char']
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    profile: {
        fullname: {type: String, default: null},
        phone: {type: String, default: null },
        birthday: {type: String, default: null}
        // not using phone, phonenumber, birthday...
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });  
});

// userSchema.pre("save",function(next) {
//     var self = this;
//     mongoose.models["users"].findOne({email : self.email},function(err, results) {
//         if(err) {
//             next(err);
//         } else if(results) { //there was a result found, so the email address exists
//             self.invalidate("email","email must be unique");
//             return next(new Error("email must be unique"));
//         } else {
//             next();
//         }
//     });
//     next();
// });

module.exports = mongoose.model("users",userSchema) ;
