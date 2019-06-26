const User = require('./../models/user');
const Image = require('./../models/image');

module.exports = {
    getDashBoard,
    delAllKYCImg
}

async function getDashBoard(userID){
    const admin = await User.findById(userID);
    if(admin){

        if(admin.role == 'admin'){
            return {statusCode: 1, message:"Get dashboard page"}
        }
        return {statusCode: 0, message:"You are not permitted"}
    }
    return {statusCode: 0, message: "Error occurred"}
}
async function delAllKYCImg(){
    const allImg = await Image.remove({});
    if(allImg) {
        return {statusCode: 1, message: "Delete all KYC image successful"}
    }
    return {statusCode: 0, message: "Error occurred"}
}