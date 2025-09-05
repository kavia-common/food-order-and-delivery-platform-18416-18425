const { randomUUID } = require('crypto');

/**
 * Simple in-memory datastore to mimic a database.
 * NOTE: Replace with a real DB adapter (e.g., PostgreSQL, MongoDB, or the provided food_order_database) as needed.
 */
class DataStore {
  constructor() {
    this.users = []; // { id, name, email, passwordHash, role }
    this.menuItems = []; // { id, name, description, price, isAvailable }
    this.orders = []; // { id, userId, items: [{menuItemId, quantity}], total, status, createdAt, updatedAt }
  }

  // USERS
  createUser(user) {
    const doc = { id: randomUUID(), ...user };
    this.users.push(doc);
    return doc;
  }
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.users.find(u => u.id === id);
  }
  listUsers() {
    return [...this.users];
  }

  // MENU
  createMenuItem(item) {
    const doc = { id: randomUUID(), isAvailable: true, ...item };
    this.menuItems.push(doc);
    return doc;
  }
  updateMenuItem(id, patch) {
    const idx = this.menuItems.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.menuItems[idx] = { ...this.menuItems[idx], ...patch };
    return this.menuItems[idx];
  }
  deleteMenuItem(id) {
    const idx = this.menuItems.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.menuItems.splice(idx, 1);
    return true;
  }
  getMenuItem(id) {
    return this.menuItems.find(m => m.id === id);
  }
  listMenuItems({ onlyAvailable = false } = {}) {
    return onlyAvailable ? this.menuItems.filter(m => m.isAvailable) : [...this.menuItems];
  }

  // ORDERS
  createOrder(order) {
    const now = new Date().toISOString();
    const doc = { id: randomUUID(), status: 'pending', createdAt: now, updatedAt: now, ...order };
    this.orders.push(doc);
    return doc;
  }
  getOrder(id) {
    return this.orders.find(o => o.id === id);
  }
  listOrders(filter = {}) {
    let data = [...this.orders];
    if (filter.userId) data = data.filter(o => o.userId === filter.userId);
    if (filter.status) data = data.filter(o => o.status === filter.status);
    return data;
  }
  updateOrderStatus(id, status) {
    const idx = this.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.orders[idx] = { ...this.orders[idx], status, updatedAt: new Date().toISOString() };
    return this.orders[idx];
  }

  // Utilities for totals
  computeOrderTotal(items) {
    let total = 0;
    for (const it of items) {
      const menu = this.getMenuItem(it.menuItemId);
      if (!menu || !menu.isAvailable) {
        throw Object.assign(new Error('Menu item unavailable'), { status: 400 });
      }
      total += Number(menu.price) * Number(it.quantity);
    }
    return Math.round(total * 100) / 100;
  }
}

// Singleton
const store = new DataStore();

module.exports = store;
