import { loggerFactory } from '../../server/logger.js';
import { CyberiaMapService } from './cyberia-map.service.js';

const logger = loggerFactory(import.meta);

class CyberiaMapController {
  static async post(req, res, options) {
    try {
      const result = await CyberiaMapService.post(req, res, options);
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
      const result = await CyberiaMapService.get(
        {
          ...req,
          path: req.path,
          params: req.params,
          query: { ...req.query, page: parseInt(page), limit: parseInt(limit) },
        },
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
      const result = await CyberiaMapService.put(req, res, options);
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
      const result = await CyberiaMapService.delete(req, res, options);
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

export { CyberiaMapController };
