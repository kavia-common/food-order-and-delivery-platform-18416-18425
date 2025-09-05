const userService = require('../services/user.service');

class UserController {
  async me(req, res, next) {
    try {
      const data = userService.getProfile(req.user.id);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const data = userService.listUsers();
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
