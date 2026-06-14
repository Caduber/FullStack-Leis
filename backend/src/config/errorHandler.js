import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  logger.error('Erro não tratado', { error: err.message, stack: err.stack });

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
