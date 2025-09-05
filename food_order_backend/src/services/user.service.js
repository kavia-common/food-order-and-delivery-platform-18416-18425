const store = require('../models/datastore');

class UserService {
  /**
   * PUBLIC_INTERFACE
   * getProfile returns public data of the current user
   */
  getProfile(userId) {
    const user = store.findUserById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  /**
   * PUBLIC_INTERFACE
   * listUsers returns all users (admin only)
   */
  listUsers() {
    return store.listUsers().map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  }
}

module.exports = new UserService();
