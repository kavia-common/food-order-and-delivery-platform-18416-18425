const authService = require('../services/auth.service');

class AuthController {
  /**
   * Handle user registration
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body || {});
      res.status(201).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Handle user login
   */
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body || {});
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
