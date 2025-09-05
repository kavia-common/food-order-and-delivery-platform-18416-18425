const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Routers
const rootRoutes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');

// Middleware
const { notFoundHandler, errorHandler, requestLogger, securityHeaders } = require('./middleware');

// Initialize express app
const app = express();

// Security, logging, parsing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(securityHeaders);
app.use(requestLogger);
app.set('trust proxy', true);
app.use(express.json());

// Swagger UI with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      { url: `${protocol}://${fullHost}` },
    ],
    tags: [
      ...(swaggerSpec.tags || []),
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Menu', description: 'Menu item operations' },
      { name: 'Orders', description: 'Order processing and tracking' }
    ]
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Root and versioned routes
app.use('/', rootRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/orders', orderRoutes);

// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
