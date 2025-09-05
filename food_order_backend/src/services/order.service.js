const store = require('../models/datastore');

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];

class OrderService {
  /**
   * PUBLIC_INTERFACE
   * create a new order for a user with items [{menuItemId, quantity}]
   */
  createOrder(userId, { items }) {
    if (!Array.isArray(items) || items.length === 0) {
      throw Object.assign(new Error('items array is required'), { status: 400 });
    }
    const normalized = items.map(it => ({
      menuItemId: String(it.menuItemId),
      quantity: Math.max(1, Number(it.quantity || 1))
    }));
    const total = store.computeOrderTotal(normalized);
    return store.createOrder({ userId, items: normalized, total });
  }

  /**
   * PUBLIC_INTERFACE
   * get order by id; ensures user can access
   */
  getOrder(user, id) {
    const order = store.getOrder(id);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    if (user.role !== 'admin' && order.userId !== user.id) {
      throw Object.assign(new Error('Forbidden'), { status: 403 });
    }
    return order;
  }

  /**
   * PUBLIC_INTERFACE
   * list orders; if user is not admin, restrict to own orders
   */
  listOrders(user, { status } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (user.role !== 'admin') filter.userId = user.id;
    return store.listOrders(filter);
  }

  /**
   * PUBLIC_INTERFACE
   * update order status (admin or owner can cancel their pending order)
   */
  updateStatus(user, id, nextStatus) {
    if (!VALID_STATUSES.includes(nextStatus)) {
      throw Object.assign(new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`), { status: 400 });
    }
    const order = store.getOrder(id);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });

    if (user.role === 'admin') {
      return store.updateOrderStatus(id, nextStatus);
    }

    // Non-admin: can only cancel own pending order
    if (user.id === order.userId && nextStatus === 'cancelled' && order.status === 'pending') {
      return store.updateOrderStatus(id, 'cancelled');
    }
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

module.exports = new OrderService();
