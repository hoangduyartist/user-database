const fs = require('fs');
const path = require('path');

const adminService = require('./../services/adminService');
const imgService = require('./../services/imgService');
const userService = require('./../services/userService');

module.exports = {
    // dashBoard,
    showKYCImg,
    showOwnerKYCImg,
    activateKYC,
    delAllKYCImg
}

// /**
//  * @swagger
//  * /admin/dashboard:
//  *   get:
//  *     description: Return dashboard page for admin after login
//  *     tags:
//  *       - admin
//  *     produces:
//  *       - application/json
//  *     consumes:
//  *       - application/json
//  *     parameters:
//  *       - name: Authorization
//  *         in: header
//  *     responses:
//  *       200:
//  *         description: Dashboard page returned
//  *       401: 
//  *         description: Unauthorize 
//  *         schema:
//  //*          $ref: '#/definitions/fetchData'
//  */
// function dashBoard(req, res) {
//     adminService.getDashBoard(req.decoded.userID)
//         .then(data => res.send(data))
//         .catch(error => res.send(error))
// }

/**
 * @swagger
 * /admin/dashboard/kyc-verify:
 *   get:
 *     description: fetch all non-KYC user
 *     tags:
 *       - admin
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Return all non-KYC-verify user 
 *       401: 
 *         description: Unauthorize 
 */
function showKYCImg(req, res) {
    imgService.showKYCImg()
        .then(data => res.send(data))
        .catch(error => res.send(error))
}

/**
 * @swagger
 * /admin/dashboard/kyc-verify/{userID}:
 *   get:
 *     description: fetch KYC-img and userID
 *     tags:
 *       - admin
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: userID
 *         in: path
 *         type: string 
 *         require: true 
 *     responses:
 *       200:
 *         description: Return KYC-img 
 *       401: 
 *         description: Unauthorize 
 */
function showOwnerKYCImg(req, res) {

    imgService.showOwnerKYCImg(req.params.userID)
        .then(data => res.send(data))
        .catch(error => res.send(error))
}

/**
 * @swagger
 * /admin/dashboard/kyc-verify/confirm/{userID}:
 *   get:
 *     description: activate user with KYC authentication
 *     tags:
 *       - admin
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: userID
 *         in: path
 *         type: string 
 *         require: true 
 *     responses:
 *       200:
 *         description: Return KYC-img 
 *       401: 
 *         description: Unauthorize 
 */
function activateKYC(req, res) {
    userService.activateKYC(req.params.userID)
        .then(data => res.send(data))
        .catch(error => res.send(error))
}

/**
 * @swagger
 * /admin/dashboard/kyc-verify/del-img-all:
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