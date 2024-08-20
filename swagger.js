const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'User Profile API',
        version: '1.0.0',
        description: 'CRUD operations for User Profile with validation'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server'
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
