import { loggerFactory } from '../../server/logger.js';
import { CryptoController } from './crypto.controller.js';
import express from 'express';
const logger = loggerFactory(import.meta);

class CryptoRouter {
  /**
   * Builds and returns the Express Router for this API.
   * @param {import('../../server/auth.js').RouterOptions} options
   * @returns {import('express').Router}
   * @memberof CryptoRouter
   */
  static router(options) {
  const router = express.Router();
  const { authMiddleware } = options;
  router.post(`/:id`, async (req, res) => await CryptoController.post(req, res, options));
  router.post(`/`, authMiddleware, async (req, res) => await CryptoController.post(req, res, options));
  router.get(`/:id`, async (req, res) => await CryptoController.get(req, res, options));
  router.get(`/`, async (req, res) => await CryptoController.get(req, res, options));
  router.delete(`/:id`, async (req, res) => await CryptoController.delete(req, res, options));
  router.delete(`/`, async (req, res) => await CryptoController.delete(req, res, options));
  return router;
  }
}

const ApiRouter = (options) => CryptoRouter.router(options);

export { ApiRouter, CryptoRouter };
