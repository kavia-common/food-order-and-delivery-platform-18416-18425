const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const store = require('../models/datastore');

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('Server misconfiguration: JWT_SECRET not set'), { status: 500 });
  }
  const payload = { sub: user.id, role: user.role || 'user' };
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
}

class AuthService {
  /**
   * PUBLIC_INTERFACE
   * register creates a new user if email not used; returns user public data and JWT.
   */
  async register({ name, email, password, role = 'user' }) {
    if (!name || !email || !password) {
      throw Object.assign(new Error('name, email, and password are required'), { status: 400 });
    }
    const existing = store.findUserByEmail(email);
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = store.createUser({ name, email, passwordHash, role });
    const token = signToken(user);
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  /**
   * PUBLIC_INTERFACE
   * login authenticates by email/password and returns JWT if valid.
   */
  async login({ email, password }) {
    if (!email || !password) {
      throw Object.assign(new Error('email and password are required'), { status: 400 });
    }
    const user = store.findUserByEmail(email);
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    const token = signToken(user);
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }
}

module.exports = new AuthService();
