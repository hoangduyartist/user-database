const mongoose = require("mongoose");
let item = require('./../models/item');
let itemService = require('./../services/itemService');

let testobj = {
    "status": "fetch API test",
    "characters": [
        {
            "id": 1,
            "name": "Peter Dinklage",
            "age": 45
        },
        {
            "id": 2,
            "name": "Lina Heady",
            "age": 43
        }]
};

module.exports = {
    // authenticate,
    createNew,
    fetchTest,
    fetchTestWithID,
    postTest,
    deleteWithID,
    deleteAll,
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

    // itemService.fetchTest()
    //     .then(data => {
    //         if (data) {
    //             testlist = data;
    //             return res.status(200).send(data);
    //         }
    //         return res.status(500).send({ msg: "error" });
    //     })
    //     .catch(err => console.log(err));
    if(testobj.characters <= 0)
    return res.send({message: "Empty"})
    return res.send(testobj)
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
//  *          $ref : '#/definitions/test' 
 */
function fetchTestWithID(req,res){
    // itemService.fetchTestWithID(req.params.testID)
    // .then(data => res.send(data))
    if(testobj.characters <= 0)
    return res.send({message: "Empty"})
    return res.send( testobj.characters.filter(characters=>characters.id == req.params.testID) )
}
/**
 * @swagger
 * /test/new:
 *   post:
 *     description: Send new test-info to server to create new test item
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json   
 *       - application/x-www-form-urlencoded   
 *     parameters:
 *       - name: test-info
 *         description: test info
 *         in: body
 *         required: true
  *         schema:
  *           example: {
  *             "name": "new test name",
  *             "age": 21
  *           }
 *     responses:
 *       200:
 *         description: (status:1) Email found and send code to your email
 *       401:
 *         description: (status:0) Bad email, not found in db
 */
function postTest(req,res){
    let numIDarr = testobj.characters.reduce((arr,item)=>[...arr,item.id],[])

    let id = 0
    if(testobj.characters.length > 0)
    id = Math.max(...numIDarr) + 1
    let newTest = {
        id: id,
        name: req.body.name,
        age: parseInt(req.body.age) 
    }
    testobj.characters.push(newTest)
    return res.status(201).send({message: 'Test created'});
}
/**
 * @swagger
 * /test/delete/{testID}:
 *   delete:
 *     description: Delete test item with id
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: testID
 *         type: number
 *         require: true 
 *         in: path
 *     responses:
 *       200:
 *         description: Delete test item successful
 *       401: 
 *         description: Unauthorize 
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
function deleteWithID(req,res){
    let getTestItem = testobj.characters.findIndex(test => test.id == req.params.testID) 

    if(getTestItem == -1)
    return res.status(404).send({message: "Not found"})
    
    testobj.characters.splice(getTestItem,1)
    return res.send({message: `Delete test with index ${getTestItem} successful`})
}
/**
 * @swagger
 * /test/delete-all:
 *   delete:
 *     description: Delete all test item 
 *     tags:
 *       - data-test
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         type: string
 *         in: header
 *     responses:
 *       200:
 *         description: Delete all test item successful
 *       401: 
 *         description: Unauthorize 
 *         schema:
 //*          $ref: '#/definitions/fetchData'
 */
function deleteAll(req,res){

    if(req.decoded.role != 'admin')
    return res.send({message: "You 'll need to provide aministrator permission to delete all item"})

    if(testobj.characters.length == 0)
    return res.status(404).send({message: "Empty"})
    
    testobj.characters.splice(0,testobj.characters.length)
    return res.send({message: `Delete all test item successful`})
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

