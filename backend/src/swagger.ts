import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUi from 'swagger-ui-express';
import mongooseToSwagger from 'mongoose-to-swagger';
import { Express } from 'express';
import Role from './models/role.model';
import User from './models/user.model';
import Board from './models/board.model';
import Task from './models/task.model';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Office Task Manager API',
            version: '1.0.0',
            description: 'API for Users, Roles, Boards and Tasks'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: mongooseToSwagger(User),
                Role: mongooseToSwagger(Role),
                Board: mongooseToSwagger(Board),
                Task: mongooseToSwagger(Task)
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
};
