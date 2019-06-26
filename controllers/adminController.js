const adminService = require('./../services/adminService');
const fs = require('fs');
const path = require('path');

module.exports = {
    dashBoard,
    delAllKYCImg
}

function dashBoard(req, res) {
    adminService.getDashBoard(req.decoded.userID)
        .then(data => res.send(data))
        .catch(error => res.send(error))
}

function delAllKYCImg(req, res) {

    const directory = './public/uploads';

    fs.readdir(directory, (err, files) => {
        if (err) return res.status(500).send({ statusCode: 0, message: "Error occurred" });

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) return res.status(500).send({ statusCode: 0, message: "Error occurred" });

                adminService.delAllKYCImg()
                    .then(data => res.send(data))
                    .catch(error => res.send(error))
            });
        }

    });

}