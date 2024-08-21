// configs/swagger.config.js

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Information',
        contact: {
            name: 'Developer',
        },
        },
        servers: [
        {
            url: 'http://localhost:3000',
        },
        ],
    },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
