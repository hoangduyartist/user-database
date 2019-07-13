const adminService = require('./../services/adminService');
const imgService = require('./../services/imgService');
const fs = require('fs');
const path = require('path');

module.exports = {
    dashBoard,
    delAllKYCImg
}

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     description: Return dashboard page for admin after login
 *     tags:
 *       - admin
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *     responses:
 *       200:
 *         description: Dashboard page returned
 *       401: 
 *         description: Unauthorize 
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
function dashBoard(req, res) {
    adminService.getDashBoard(req.decoded.userID)
        .then(data => res.send(data))
        .catch(error => res.send(error))
}

/**
 * @swagger
 * /admin/dashboard/KYC-verify/del-img-all:
 *   delete:
 *     description: Delete all KYC-verified images
 *     tags:
 *       - admin
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *     responses:
 *       200:
 *         description: Delete all image successful
 *       401: 
 *         description: Unauthorize 
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
function delAllKYCImg(req, res) {

    const directory = './public/uploads';

    fs.readdir(directory, (err, files) => {
        if (err) return res.status(500).send({ statusCode: 0, message: "Error occurred" });

        if (files.length == 0) return res.send({ statusCode: 0, message: "All images are deleted" });

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) return res.status(500).send({ statusCode: 0, message: "Error occurred" });

                imgService.delAllKYCImg()
                    .then(data => res.send(data))
                    .catch(error => res.send(error))
            });
        }

    });

}