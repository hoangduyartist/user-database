let Image = require("./../models/image");

module.exports = {
    create,
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

async function delAllKYCImg() {
    const allImg = await Image.remove({});
    if (allImg) {
        return { statusCode: 1, message: "Delete all KYC image successful" }
    }
    return { statusCode: 0, message: "Error occurred" }
}