// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Item = require('../models/item');

module.exports = {
    // authenticate,
    create,
    fetchTest,
    fetchTestWithID
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
async function create(itemParams) {
    // validate
    // if (await User.findOne({ name: userParams.name })) {
    //     // throw 'Username "' + userParams.name + '" is already taken'; //will be catched in .catch()
    //     return ({msg : 'Username "' + userParams.name + '" is already taken'})
    // }

    const item = new Item({
        _id: itemParams._id,
        fullname: itemParams.fullname,
        name: itemParams.name,
    });

    const newitem = await item.save();
    return newitem;
    // if(newitem)
    // return ({newItem:newitem, msg:'Successful !'})
    // return ({msg: 'Failed !'})
}
async function fetchTestWithID(ID){
    if(ID==1)
    return {"object-order":1}
    if(ID==2)
    return {"object-order":2}
    if(ID==3)
    return {"object-order":3}
    if(ID==4)
    return {"object-order":4}
}
async function fetchTest() {
    let testAPI =
    {
        "status": "fetch API test",
        "characters": [
            {
                "id": 1,
                "name": "Peter Dinklage",
                "age": "45"
            },
            {
                "id": 2,
                "name": "Lina Heady",
                "age": "43"
            },
            {
                "id": 3,
                "name": "Emilia Clarke",
                "age": "30"
            },
            {
                "id": 4,
                "name": "Kit Harrington",
                "age": "30"
            },
            {
                "id": 5,
                "name": "Sean Bean",
                "age": "50"
            }]
    }
    return testAPI;
} 