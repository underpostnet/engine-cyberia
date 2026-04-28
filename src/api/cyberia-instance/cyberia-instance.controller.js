import { loggerFactory } from '../../server/logger.js';
import { CyberiaInstanceService } from './cyberia-instance.service.js';

const logger = loggerFactory(import.meta);

class CyberiaInstanceController {
  static async fallbackWorld(req, res, options) {
    try {
      const result = await CyberiaInstanceService.fallbackWorld(req);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
  static async portalConnect(req, res, options) {
    try {
      const result = await CyberiaInstanceService.portalConnect(req, res, options);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
  static async post(req, res, options) {
    try {
      const result = await CyberiaInstanceService.post(req, res, options);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }
  static async get(req, res, options) {
    try {
      const { page, limit } = req.query;
      const result = await CyberiaInstanceService.get(
        { ...req, query: { ...req.query, page: parseInt(page), limit: parseInt(limit) } },
        res,
        options,
      );
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }
  static async put(req, res, options) {
    try {
      const result = await CyberiaInstanceService.put(req, res, options);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }
  static async delete(req, res, options) {
    try {
      const result = await CyberiaInstanceService.delete(req, res, options);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export { CyberiaInstanceController };
