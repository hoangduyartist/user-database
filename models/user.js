var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    isVerified: {
        type: Boolean,
        required: true
    },
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
    password: {
        type: String,
        required: true,
        // minlength : [4, 'at least 4 char']
    },
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