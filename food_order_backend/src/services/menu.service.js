const store = require('../models/datastore');

class MenuService {
  /**
   * PUBLIC_INTERFACE
   * list returns all or only available menu items
   */
  list({ onlyAvailable = false } = {}) {
    return store.listMenuItems({ onlyAvailable });
  }

  /**
   * PUBLIC_INTERFACE
   * create a new menu item
   */
  create({ name, description = '', price, isAvailable = true }) {
    if (!name || price == null) {
      throw Object.assign(new Error('name and price are required'), { status: 400 });
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      throw Object.assign(new Error('price must be a non-negative number'), { status: 400 });
    }
    return store.createMenuItem({ name, description, price: priceNum, isAvailable: Boolean(isAvailable) });
  }

  /**
   * PUBLIC_INTERFACE
   * get single menu item
   */
  get(id) {
    const item = store.getMenuItem(id);
    if (!item) throw Object.assign(new Error('Menu item not found'), { status: 404 });
    return item;
  }

  /**
   * PUBLIC_INTERFACE
   * update menu item
   */
  update(id, patch) {
    const payload = { ...patch };
    if (payload.price != null) {
      const priceNum = Number(payload.price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        throw Object.assign(new Error('price must be a non-negative number'), { status: 400 });
      }
      payload.price = priceNum;
    }
    if (payload.isAvailable != null) {
      payload.isAvailable = Boolean(patch.isAvailable);
    }
    const updated = store.updateMenuItem(id, payload);
    if (!updated) throw Object.assign(new Error('Menu item not found'), { status: 404 });
    return updated;
  }

  /**
   * PUBLIC_INTERFACE
   * remove menu item
   */
  remove(id) {
    const ok = store.deleteMenuItem(id);
    if (!ok) throw Object.assign(new Error('Menu item not found'), { status: 404 });
    return true;
  }
}

module.exports = new MenuService();
