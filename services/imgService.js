let Image = require("./../models/image");

module.exports = {
    create
}

async function create(images) {

    let imgNum = 0;
    await Promise.all( images.map(async (img, key) => {
        // console.log(item);
        const newImg = new Image({
            _id: img._id,
            name: img.name,
            path: img.path,  
            userID: img.userID,
            kind: img.kind 
        });

        if(await newImg.save()){
            imgNum ++;
        }
    }))

    if (imgNum == images.length) {

        return { statusCode: 1, message: "Upload successful !", imgNum };
    }

    return { statusCode: 1, message: "Upload failed !" };

}