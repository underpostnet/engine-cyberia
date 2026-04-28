import { loggerFactory } from '../../server/logger.js';
import { CyberiaInstanceConfController } from './cyberia-instance-conf.controller.js';
import express from 'express';

const logger = loggerFactory(import.meta);

class CyberiaInstanceConfRouter {
  /**
   * Builds and returns the Express Router for this API.
   * @param {import('../../server/auth.js').RouterOptions} options
   * @returns {import('express').Router}
   * @memberof CyberiaInstanceConfRouter
   */
  static router(options) {
  const router = express.Router();
  const { authMiddleware } = options;
  router.post(`/:id`, async (req, res) => await CyberiaInstanceConfController.post(req, res, options));
  router.post(`/`, async (req, res) => await CyberiaInstanceConfController.post(req, res, options));
  router.get(
    `/:id`,
    // authMiddleware,
    async (req, res) => await CyberiaInstanceConfController.get(req, res, options),
  );
  router.get(`/`, async (req, res) => await CyberiaInstanceConfController.get(req, res, options));
  router.put(`/:id`, async (req, res) => await CyberiaInstanceConfController.put(req, res, options));
  router.put(`/`, async (req, res) => await CyberiaInstanceConfController.put(req, res, options));
  router.delete(`/:id`, async (req, res) => await CyberiaInstanceConfController.delete(req, res, options));
  router.delete(`/`, async (req, res) => await CyberiaInstanceConfController.delete(req, res, options));
  return router;
  }
}

const ApiRouter = (options) => CyberiaInstanceConfRouter.router(options);

export { ApiRouter, CyberiaInstanceConfRouter };
