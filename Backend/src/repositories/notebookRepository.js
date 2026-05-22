const db = require('../db');
const { randomUUID } = require('crypto');

class Notebook {
  // Create a new notebook
  static create(userId, title, folderId = null, cover = {}) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO notebooks (
        id,
        user_id,
        folder_id,
        title,
        cover_type,
        cover_color,
        cover_image_filename,
        cover_image_original_name,
        cover_image_mimetype,
        cover_image_size
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      folderId,
      title,
      cover.cover_type || 'default',
      cover.cover_color || null,
      cover.cover_image_filename || null,
      cover.cover_image_original_name || null,
      cover.cover_image_mimetype || null,
      cover.cover_image_size || null
    );
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

  static findByFolderAndUser(folderId, userId) {
    return db.prepare(`
      SELECT * FROM notebooks
      WHERE folder_id = ? AND user_id = ?
      ORDER BY created_at DESC
    `).all(folderId, userId);
  }

  // Find notebook by ID
  static findById(id) {
    return db.prepare('SELECT * FROM notebooks WHERE id = ?').get(id);
  }

  static findByIdAndUser(id, userId) {
    return db.prepare('SELECT * FROM notebooks WHERE id = ? AND user_id = ?').get(id, userId);
  }

  // Update notebook
  static update(id, userId, title, folderId) {
    db.prepare('UPDATE notebooks SET title = ?, folder_id = ? WHERE id = ? AND user_id = ?').run(title, folderId, id, userId);
  }

  static updateCover(id, userId, cover) {
    db.prepare(`
      UPDATE notebooks
      SET
        cover_type = ?,
        cover_color = ?,
        cover_image_filename = ?,
        cover_image_original_name = ?,
        cover_image_mimetype = ?,
        cover_image_size = ?
      WHERE id = ? AND user_id = ?
    `).run(
      cover.cover_type || 'default',
      cover.cover_color || null,
      cover.cover_image_filename || null,
      cover.cover_image_original_name || null,
      cover.cover_image_mimetype || null,
      cover.cover_image_size || null,
      id,
      userId
    );
  }

  static findResourcesForDelete(id, userId) {
    return db.prepare(`
      SELECT DISTINCT r.*
      FROM resources r
      LEFT JOIN chapters c ON r.chapter_id = c.id
      WHERE r.user_id = ?
        AND (r.notebook_id = ? OR c.notebook_id = ?)
    `).all(userId, id, id);
  }

  // Delete notebook
  static delete(id, userId) {
    const deleteNotebook = db.transaction(() => {
      db.prepare(`
        DELETE FROM resources
        WHERE user_id = ?
          AND (
            notebook_id = ?
            OR chapter_id IN (
              SELECT id FROM chapters WHERE notebook_id = ? AND user_id = ?
            )
          )
      `).run(userId, id, id, userId);

      db.prepare(`
        DELETE FROM notes
        WHERE user_id = ?
          AND (
            notebook_id = ?
            OR todo_id IN (
              SELECT id FROM todos WHERE notebook_id = ? AND user_id = ?
            )
          )
      `).run(userId, id, id, userId);
      db.prepare('DELETE FROM chapters WHERE notebook_id = ? AND user_id = ?').run(id, userId);
      db.prepare('UPDATE todos SET notebook_id = NULL WHERE notebook_id = ? AND user_id = ?').run(id, userId);
      db.prepare('DELETE FROM notebooks WHERE id = ? AND user_id = ?').run(id, userId);
    });

    deleteNotebook();
  }
}

module.exports = Notebook;
