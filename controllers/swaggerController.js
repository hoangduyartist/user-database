const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const config = require('./../config')

const options = {
    swaggerDefinition: {
        info: {
            title: 'REST - Swagger',
            version: '1.0.0',
            description: 'REST API with Swagger doc',
            contact: {
                email: 'hoangduy.artist@gmail.com'
            }
        },
        definitions: {
            test: {
                properties: {
                    id : {type: Number},
                    name: {type: String},
                    age: {type: Number}
                }
            },
        },
        // tags: [
        //   {
        //     name: 'stocks',
        //     description: 'Stocks API',
        //   }
        // ],
        schemes: ['http','https'],
        host: `${config.HOST}:${config.PORT}`,
        basePath: '/web-api'
    },
    apis: [ './controllers/userController.js', './controllers/adminController.js', './controllers/itemController.js', './models/*.js','./routers/webAPI.js']

}

const swaggerSpec = swaggerJSDoc(options)
require('swagger-model-validator')(swaggerSpec)

module.exports = {
    swaggerUI,
    getJson,
    swaggerSpec,
    validateModel,

}

function getJson(req, res) {
    res.setHeader('Content-Type', 'application/json')
    return res.send(swaggerSpec)
}

function validateModel(name, model) {
    const responseValidation = swaggerSpec.validateModel(name, model, false, true)
    if (!responseValidation.valid) {
        console.error(responseValidation.errors)
        throw new Error(`Model doesn't match Swagger contract`)
    }
}

/**
 * @swagger
 * definitions:
 *   TimeStamp:
 *     type: object
 *     required:
 *       - lastUpdate
 *     properties:
 *       lastUpdate:
 *         type: number
 */


// $ npm install --save mongoose-to-swagger
// const mongoose = require('mongoose');
// const m2s = require('mongoose-to-swagger');
// const Cat = mongoose.model('Cat', { name: String });
// const swaggerSchema = m2s(Cat);
// console.log(swaggerSchema);

