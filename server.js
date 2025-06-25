require('dotenv').config(); // Load .env variables

const express = require('express');
const app = express();

// Swagger
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('./swaggerConfig');

// Middlewares
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { errorHandler, NotFoundError } = require('./utils/errors');

// Built-in JSON parser
app.use(express.json());

// Custom logger: logs method, URL, timestamp
app.use(logger);

// Authentication middleware for protected routes
app.use(auth);

// Mount routes
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Swagger UI setup (✅ Corrected)
app.use('/api-docs', swaggerUi.serve, swaggerDocs);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
