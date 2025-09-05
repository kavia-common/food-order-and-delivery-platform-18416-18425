const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    // Lightweight log
    console.log(`${method} ${originalUrl} ${status} - ${duration}ms`);
  });
  next();
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  res.status(status).json({ status: 'error', message });
};

module.exports = {
  securityHeaders,
  requestLogger,
  notFoundHandler,
  errorHandler
};
