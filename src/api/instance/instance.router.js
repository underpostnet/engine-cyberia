import { adminGuard } from '../../server/auth.js';
import { loggerFactory } from '../../server/logger.js';
import { InstanceController } from './instance.controller.js';
import express from 'express';

const logger = loggerFactory(import.meta);

class InstanceRouter {
  /**
   * Builds and returns the Express Router for this API.
   * @param {import('../../server/auth.js').RouterOptions} options
   * @returns {import('express').Router}
   * @memberof InstanceRouter
   */
  static router(options) {
  const router = express.Router();
  const { authMiddleware } = options;
  router.post(`/:id`, authMiddleware, adminGuard, async (req, res) => await InstanceController.post(req, res, options));
  router.post(`/`, authMiddleware, adminGuard, async (req, res) => await InstanceController.post(req, res, options));
  router.get(`/:id`, authMiddleware, adminGuard, async (req, res) => await InstanceController.get(req, res, options));
  router.get(`/`, authMiddleware, async (req, res) => await InstanceController.get(req, res, options));
  router.put(`/:id`, authMiddleware, adminGuard, async (req, res) => await InstanceController.put(req, res, options));
  router.put(`/`, authMiddleware, adminGuard, async (req, res) => await InstanceController.put(req, res, options));
  router.delete(
    `/:id`,
    authMiddleware,
    adminGuard,
    async (req, res) => await InstanceController.delete(req, res, options),
  );
  router.delete(
    `/`,
    authMiddleware,
    adminGuard,
    async (req, res) => await InstanceController.delete(req, res, options),
  );
  return router;
  }
}

const ApiRouter = (options) => InstanceRouter.router(options);

export { ApiRouter, InstanceRouter };
