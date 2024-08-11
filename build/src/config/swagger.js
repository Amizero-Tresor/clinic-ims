// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Clinic IMS API',
        version: '1.0.0',
        description: 'API documentation for Clinic Inventory Management System',
    },
    servers: [
        {
            url: 'http://localhost:5000', // Change this to your server URL
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // Path to the API docs
};
const swaggerSpec = swaggerJSDoc(options);
export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
