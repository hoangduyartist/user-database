const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
    authenticate,
    create

};

async function create(userParams) {
    // validate
    if (await User.findOne({ username: userParams.username, email: userParams.email })) {
        return ({status: "error", message: 'Username "' + userParams.username + '" is already taken' })
    }

    const user = new User({
        _id: userParams._id,
        username: userParams.username,
        email: userParams.email,
        password: userParams.password
    });

    const newuser = await user.save();
    if (newuser)
        return ({status: "success", newuser: newuser, message: "Register successful!" })
    return ({status: "error", message: "Register failed" })

}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username: username })
    if (!user)
        return ({ msg: 'user-name is incorrect!' })

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'secret12345', { expiresIn: '1h' });
        return { status: "success", message: "user found!", data: { user: user, token: token } }
    }
    else {
        return { status: "error", message: "Invalid email/password!", data: null };
    }
}
// async function update(usrID,userParams){
//     let updatedUsr = await User.findByIdAndUpdate(usrID,userParams);
//     if (updatedUsr)
//     return ({updatedUser:updatedUsr,msg:'Update successful !'})
//     return ({msg:'Register failed !'})
// } 