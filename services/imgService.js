let Image = require("./../models/image");
let User = require("./../models/user");

module.exports = {
    create,
    showKYCImg,
    showOwnerKYCImg,
    delAllKYCImg
}

async function create(images) {

    let quantity = 0;
    const saveImages = await Promise.all(images.map(async (img, key) => {

        if (await Image.create(img)) {
            quantity++;
        }
    }))

    if (saveImages) {

        return { statusCode: 1, message: "Upload successful", quantity };
    }

    return { statusCode: 0, message: "Upload failed" };

}

async function showKYCImg(){
    const userList = await User.find({isKYCVerified: false}, {_id: true, profile: true, isKYCVerified: true})
    if(userList)
    return { statusCode: 1, message: "All non-KYC-verify user", data: userList };
} 

async function showOwnerKYCImg(userID) {
    const img = await Image.findOne({ userID });

    if (img)
        return { statusCode: 1, message: "Fetch KYC-img successful", data: img }

    return { statusCode: 0, message: "Img not found or error occured " }
}

async function delAllKYCImg() {
    const allImg = await Image.remove({});
    if (allImg) {
        return { statusCode: 1, message: "Delete all KYC image successful" }
    }
    return { statusCode: 0, message: "Error occurred" }
}