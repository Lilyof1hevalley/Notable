const db = require('../../database/db');
const { randomUUID } = require('crypto');

class Folder {
  // Create a new folder
  static create(userId, title) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO folders (id, user_id, title)
      VALUES (?, ?, ?)
    `).run(id, userId, title);
    return id;
  }

  // Get all folders for a user
  static findAllByUser(userId) {
    return db.prepare('SELECT * FROM folders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  // Find folder by ID
  static findById(id) {
    return db.prepare('SELECT * FROM folders WHERE id = ?').get(id);
  }

  // Update folder title
  static update(id, title) {
    db.prepare('UPDATE folders SET title = ? WHERE id = ?').run(title, id);
  }

  // Delete folder
  static delete(id) {
    db.prepare('DELETE FROM folders WHERE id = ?').run(id);
  }
}

module.exports = Folder;