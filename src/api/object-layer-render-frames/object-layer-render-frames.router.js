import { loggerFactory } from '../../server/logger.js';
import { ObjectLayerRenderFramesController } from './object-layer-render-frames.controller.js';
import express from 'express';

const logger = loggerFactory(import.meta);

class ObjectLayerRenderFramesRouter {
  /**
   * Builds and returns the Express Router for this API.
   * @param {import('../../server/auth.js').RouterOptions} options
   * @returns {import('express').Router}
   * @memberof ObjectLayerRenderFramesRouter
   */
  static router(options) {
  const router = express.Router();
  const { authMiddleware } = options;
  router.post(`/:id`, async (req, res) => await ObjectLayerRenderFramesController.post(req, res, options));
  router.post(`/`, async (req, res) => await ObjectLayerRenderFramesController.post(req, res, options));
  router.get(
    `/:id`,
    // authMiddleware,
    async (req, res) => await ObjectLayerRenderFramesController.get(req, res, options),
  );
  router.get(`/`, async (req, res) => await ObjectLayerRenderFramesController.get(req, res, options));
  router.put(`/:id`, async (req, res) => await ObjectLayerRenderFramesController.put(req, res, options));
  router.put(`/`, async (req, res) => await ObjectLayerRenderFramesController.put(req, res, options));
  router.delete(`/:id`, async (req, res) => await ObjectLayerRenderFramesController.delete(req, res, options));
  router.delete(`/`, async (req, res) => await ObjectLayerRenderFramesController.delete(req, res, options));
  return router;
  }
}

const ApiRouter = (options) => ObjectLayerRenderFramesRouter.router(options);

export { ApiRouter, ObjectLayerRenderFramesRouter };
