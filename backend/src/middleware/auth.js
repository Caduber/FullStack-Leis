import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

const blacklist = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Token não fornecido.' } });
  }

  const token = header.split(' ')[1];

  if (blacklist.has(token)) {
    return res.status(401).json({ error: { message: 'Token inválido ou expirado.' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Token inválido ou expirado.' } });
  }
}

export function addToBlacklist(token) {
  blacklist.set(token, true);
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' } },
  standardHeaders: true,
  legacyHeaders: false,
});
