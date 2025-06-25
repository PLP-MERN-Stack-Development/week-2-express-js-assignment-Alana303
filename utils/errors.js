// utils/errors.js

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      name: err.name || 'InternalServerError',
      message: err.message || 'Something went wrong',
    }
  });
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  errorHandler,
};
