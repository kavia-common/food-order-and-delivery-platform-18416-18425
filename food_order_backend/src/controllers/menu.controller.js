const menuService = require('../services/menu.service');

class MenuController {
  async list(req, res, next) {
    try {
      const onlyAvailable = String(req.query.available || '').toLowerCase() === 'true';
      const data = menuService.list({ onlyAvailable });
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = menuService.create(req.body || {});
      res.status(201).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const data = menuService.get(req.params.id);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = menuService.update(req.params.id, req.body || {});
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await menuService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MenuController();
