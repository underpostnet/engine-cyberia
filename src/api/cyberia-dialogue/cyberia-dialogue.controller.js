import { loggerFactory } from '../../server/logger.js';
import { CyberiaDialogueService } from './cyberia-dialogue.service.js';

const logger = loggerFactory(import.meta);

class CyberiaDialogueController {
  static async post(req, res, options) {
    try {
      const result = await CyberiaDialogueService.post(req, res, options);
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
      const result = await CyberiaDialogueService.get(
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
      const result = await CyberiaDialogueService.put(req, res, options);
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
      const result = await CyberiaDialogueService.delete(req, res, options);
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
  static async getByItemId(req, res, options) {
    try {
      if (req && req.headers && req.headers.origin) {
        res.set('Access-Control-Allow-Origin', req.headers.origin);
      } else res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      const result = await CyberiaDialogueService.getByItemId(req, res, options);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export { CyberiaDialogueController };
