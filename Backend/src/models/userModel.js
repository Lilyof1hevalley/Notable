const db = require('../../database/db');
const { randomUUID } = require('crypto');

class User {

// To create new user
  static create(name, email, passwordHash, displayName) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, display_name)
      VALUES (?, ?, ?, ?, ?)`).run(id, name, email, passwordHash, displayName);
    return id;
  }

// To find user by email
  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

// To find user by user id
  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
}

module.exports = User;