import { loggerFactory } from '../../server/logger.js';
import { CryptoService } from './crypto.service.js';
const logger = loggerFactory(import.meta);

class CryptoController {
  static async post(req, res, options) {
    try {
      return res.status(200).json({
        status: 'success',
        data: await CryptoService.post(req, res, options),
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
      return res.status(200).json({
        status: 'success',
        data: await CryptoService.get(req, res, options),
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
      const result = await CryptoService.delete(req, res, options);
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

export { CryptoController };
