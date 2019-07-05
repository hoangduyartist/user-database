const mongoose = require("mongoose");
let item = require('./../models/item');
let itemService = require('./../services/itemService');

module.exports = {
    // authenticate,
    createNew,
    fetchTest,
    fetchTestWithID,
    protectRouter
    // update
};

function createNew(req, res) {
    let newItem = new item({
        _id: new mongoose.Types.ObjectId(),
        fullname: req.body.fullname,
        name: req.body.name,
    })
    itemService.create(newItem)
        .then(data => {
            if (data) {
                return res.status(200).send(newItem);
                // return ({newItem: newItem1})
            }
            return res.status(500).send({ msg: "error" });
        })
        .catch(err => console.log(err));
}

/**
 * @swagger
 * /test:
 *   get:
 *     description: Retrieve the full list of data test
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: fetch data test
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
function fetchTest(req, res) {
    // res.send({arrayObj : "sdfsf"})
    itemService.fetchTest()
        .then(data => {
            if (data) {
                return res.status(200).send(data);
            }
            return res.status(500).send({ msg: "error" });
        })
        .catch(err => console.log(err));
}

/**
 * @swagger
 * /test/{testID}:
 *   get:
 *     description: test
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: testID
 *         description: id of data test
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: ok
 *         schema:
 *          $ref : '#/definitions/test' 
 */
function fetchTestWithID(req,res){
    itemService.fetchTestWithID(req.params.testID)
    .then(data => res.send(data))
}
/**
 * @swagger
 * /mainpagetest:
 *   get:
 *     description: Return main page after login
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/x-www-form-urlencoded 
 *     parameters:
 *       - name: Authorization
 *         in: header
 *     responses:
 *       200:
 *         description: fetch data test
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
async function protectRouter(req, res) {

    if (typeof req.decoded != 'undefined'){
        return res.send({text:"protected router !", data:req.decoded })
    }
    return res.send({statusCode:0, message: 'Error occurred !'});

}