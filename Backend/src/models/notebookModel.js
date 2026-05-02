const db = require('../../database/db');
const { randomUUID } = require('crypto');

class Notebook {
  // Create a new notebook
  static create(userId, title, folderId = null) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO notebooks (id, user_id, folder_id, title)
      VALUES (?, ?, ?, ?)
    `).run(id, userId, folderId, title);
    return id;
  }

  // Get all notebooks for a user
  static findAllByUser(userId) {
    return db.prepare('SELECT * FROM notebooks WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  // Get all notebooks inside a folder
  static findByFolder(folderId) {
    return db.prepare('SELECT * FROM notebooks WHERE folder_id = ? ORDER BY created_at DESC').all(folderId);
  }

  // Find notebook by ID
  static findById(id) {
    return db.prepare('SELECT * FROM notebooks WHERE id = ?').get(id);
  }

  // Update notebook
  static update(id, title, folderId) {
    db.prepare('UPDATE notebooks SET title = ?, folder_id = ? WHERE id = ?').run(title, folderId, id);
  }

  // Delete notebook
  static delete(id) {
    db.prepare('DELETE FROM notebooks WHERE id = ?').run(id);
  }
}

module.exports = Notebook;