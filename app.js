const express = require('express');
const cors = require('cors');
const { app: appConfig } = require('./config/config');

// Connexion MySQL
require('./config/db');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authMiddleware = require('./middleware/auth.middleware');

const authRoutes = require('./routes/auth.route');
const userRouter = require('./routes/users.route');
const articleRouter = require('./routes/articles.route');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      },
      servers: [
        {
          url: `http://localhost:${appConfig.port}`,
        },
      ],
    },
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'], // adjust this based on your project structure
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/articles',authMiddleware, articleRouter);

// Serve static files from the 'public' directory
app.use(express.static('assets/public'));

app.listen(appConfig.port, () => {
    console.log(`Server running in ${appConfig.env} mode on port ${appConfig.port}`);
    console.log(`Swagger docs available at http://localhost:${appConfig.port}/api-docs`);
});