// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Item = require('../models/item');

module.exports = {
    // authenticate,
    create
    // update
};

// async function authenticate({name, password}){
//     const user = await User.findOne({name:name})
//     if(!user)
//     return ({msg:'user-name is incorrect !'})
    
//     if (user && bcrypt.compareSync(password, user.password)) {
//         return {
//             session:user._id,
//             user,
//             msg:'OK'
//         };
//     }

//     return ({msg:'password is incorrect !'});
// }
async function create(itemParams){
    // validate
    // if (await User.findOne({ name: userParams.name })) {
    //     // throw 'Username "' + userParams.name + '" is already taken'; //will be catched in .catch()
    //     return ({msg : 'Username "' + userParams.name + '" is already taken'})
    // }

    const item = new Item({
        _id : itemParams._id,
        fullname : itemParams.fullname,
        name : itemParams.name,
    });
    
    const newitem = await item.save();
    return newitem;
    // if(newitem)
    // return ({newItem:newitem, msg:'Successful !'})
    // return ({msg: 'Failed !'})
}
// async function update(usrID,userParams){
//     let updatedUsr = await User.findByIdAndUpdate(usrID,userParams);
//     if (updatedUsr)
//     return ({updatedUser:updatedUsr,msg:'Update successful !'})
//     return ({msg:'Register failed !'})
// } 