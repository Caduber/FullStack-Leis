import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import Proposta from '../models/Proposta.js';
import { verifyToken } from '../middleware/auth.js';
import cache from '../config/cache.js';
import logger from '../utils/logger.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

router.get(
  '/',
  verifyToken,
  [
    query('keyword')
      .optional()
      .trim()
      .escape()
      .isLength({ min: 3 }).withMessage('A palavra-chave deve ter no mínimo 3 caracteres.'),
    handleValidation,
  ],
  async (req, res) => {
    try {
      const { keyword } = req.query;

      if (!keyword || keyword.trim().length < 3) {
        const resultados = await Proposta.listAll();
        return res.json({ resultados });
      }

      const cacheKey = `propostas:${keyword}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        logger.info('Cache hit - busca propostas', { keyword, userId: req.user.id });
        return res.json({ resultados: cached });
      }

      const resultados = await Proposta.search(keyword);

      cache.set(cacheKey, resultados);

      logger.info('Busca de propostas', { keyword, userId: req.user.id, count: resultados.length });

      res.json({ resultados });
    } catch (err) {
      logger.error('Erro ao buscar propostas', { error: err.message, keyword: req.query.keyword });
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  },
);

router.post(
  '/',
  verifyToken,
  [
    body('siglaTipo')
      .trim()
      .escape()
      .notEmpty().withMessage('A sigla do tipo é obrigatória.')
      .isLength({ max: 10 }).withMessage('A sigla do tipo deve ter no máximo 10 caracteres.'),
    body('numero')
      .notEmpty().withMessage('O número é obrigatório.')
      .isInt({ min: 1 }).withMessage('O número deve ser um valor inteiro positivo.'),
    body('ano')
      .notEmpty().withMessage('O ano é obrigatório.')
      .isInt({ min: 1900, max: 2030 }).withMessage('O ano deve ser um valor inteiro entre 1900 e 2030.'),
    body('ementa')
      .trim()
      .escape()
      .notEmpty().withMessage('A ementa é obrigatória.')
      .isLength({ max: 1000 }).withMessage('A ementa deve ter no máximo 1000 caracteres.'),
    body('dataApresentacao')
      .notEmpty().withMessage('A data de apresentação é obrigatória.')
      .isDate().withMessage('Formato de data inválido.'),
    body('uri')
      .optional({ values: 'falsy' })
      .trim()
      .escape(),
    handleValidation,
  ],
  async (req, res) => {
    try {
      const { siglaTipo, numero, ano, ementa, dataApresentacao, uri } = req.body;

      const proposta = await Proposta.create({
        sigla_tipo: siglaTipo,
        numero,
        ano,
        ementa,
        data_apresentacao: dataApresentacao,
        uri,
        user_id: req.user.id,
      });

      const cacheKeys = cache.keys().filter(k => k.startsWith('propostas:'));
      cacheKeys.forEach(k => cache.del(k));

      logger.info('Proposta inserida', {
        propostaId: proposta.id,
        siglaTipo,
        numero,
        ano,
        userId: req.user.id,
      });

      res.status(201).json({ proposta });
    } catch (err) {
      logger.error('Erro ao inserir proposta', { error: err.message });
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  },
);

export default router;
