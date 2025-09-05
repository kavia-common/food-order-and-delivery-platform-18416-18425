const orderService = require('../services/order.service');

class OrderController {
  async create(req, res, next) {
    try {
      const data = orderService.createOrder(req.user.id, req.body || {});
      res.status(201).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const data = orderService.getOrder(req.user, req.params.id);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const data = orderService.listOrders(req.user, { status: req.query.status });
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const data = orderService.updateStatus(req.user, req.params.id, req.body?.status);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
