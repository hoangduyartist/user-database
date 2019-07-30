let Image = require("./../models/image");
let User = require("./../models/user");

module.exports = {
    findByUserID,
    create,
    showKYCImg,
    showOwnerKYCImg,
    delKYCImgWithOwner,
    delAllKYCImg
}

async function findByUserID(userID){
    return await Image.find({userID})
}


async function create(images) {

    let quantity = 0;
    const saveImages = await Promise.all(images.map(async (img, key) => {

        if (await Image.create(img)) {
            quantity++;
        }
    }))

    if (saveImages) {

        return { status: 1, message: "Upload successful", quantity };
    }

    return { status: 0, message: "Upload failed" };

}

async function showKYCImg(){
    const userList = await User.find({isKYCVerified: false}, {_id: true, profile: true, isKYCVerified: true})

    if(userList && userList.length>0){
        let usrList = []
        await Promise.all( userList.map(async user => {
            const uploaded = await Image.find({userID: user._id})
            if(uploaded.length>0){
                usrList.push(user);
            }
        }) )
        return { status: 1, message: "All non-KYC-verify user", data: usrList };
    }
    

    return { status: 0, message: "Empty" };
} 

async function showOwnerKYCImg(userID) {
    const img = await Image.find({ userID });

    if (img)
        return { status: 1, message: "Fetch KYC-img successful", data: img }

    return { status: 0, message: "Img not found or error occured " }
}

async function delKYCImgWithOwner(userID) {
    const img = await Image.remove({userID});
    if (img) {
        return { status: 1, message: "Delete all KYC image of user "+userID+" successful" }
    }
    return { status: 0, message: "Error occurred" }
}

async function delAllKYCImg() {
    const allImg = await Image.remove({});
    if (allImg) {
        return { status: 1, message: "Delete all KYC image successful" }
    }
    return { status: 0, message: "Error occurred" }
}