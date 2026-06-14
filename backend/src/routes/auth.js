import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { addToBlacklist, loginLimiter, verifyToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

const SALT_ROUNDS = 12;

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

router.post(
  '/register',
  [
    body('username')
      .trim()
      .escape()
      .notEmpty().withMessage('O username é obrigatório.')
      .isLength({ min: 3, max: 30 }).withMessage('O username deve ter entre 3 e 30 caracteres.'),
    body('email')
      .trim()
      .escape()
      .notEmpty().withMessage('O email é obrigatório.')
      .isEmail().withMessage('Formato de email inválido.'),
    body('password')
      .notEmpty().withMessage('A senha é obrigatória.')
      .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
    handleValidation,
  ],
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existing = await User.findByUsername(username);
      if (existing) {
        return res.status(422).json({
          errors: [{ field: 'username', message: 'Este username já está em uso.' }],
        });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({ username, email, password_hash });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      );

      logger.info('Usuário registrado', { userId: user.id, username: user.username });

      res.status(201).json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (err) {
      logger.error('Erro ao registrar usuário', { error: err.message });
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  },
);

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().escape().notEmpty().withMessage('O username é obrigatório.'),
    body('password').notEmpty().withMessage('A senha é obrigatória.'),
    handleValidation,
  ],
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      );

      logger.info('Usuário logado', { userId: user.id, username: user.username });

      res.status(200).json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (err) {
      logger.error('Erro ao fazer login', { error: err.message });
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  },
);

router.post('/logout', verifyToken, (req, res) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];
    addToBlacklist(token);

    logger.info('Usuário fez logout', { userId: req.user.id, username: req.user.username });

    res.status(200).json({ message: 'Logout realizado' });
  } catch (err) {
    logger.error('Erro ao fazer logout', { error: err.message });
    res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
  }
});

export default router;
