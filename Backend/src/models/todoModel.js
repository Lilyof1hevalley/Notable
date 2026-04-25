const db = require('../../database/db');
const { randomUUID } = require('crypto');

class Todo {
    
// Create new todo for the user
  static create(userId, title, deadline, academicWeight) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO todos (id, user_id, title, deadline, academic_weight)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, title, deadline, academicWeight);
    return id;
  }

// Get all todos belonging to a specific user
  static findAllByUser(userId) {
    return db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

// Find a single todo by its id
  static findById(id) {
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  }

// Update todo details (id, title, deadline, academic weight)
  static update(id, title, deadline, academicWeight) {
    db.prepare(`
      UPDATE todos SET title = ?, deadline = ?, academic_weight = ?
      WHERE id = ?
    `).run(title, deadline, academicWeight, id);
  }

// To mark those todo as completed/not
  static markComplete(id) {
    db.prepare('UPDATE todos SET is_completed = 1 WHERE id = ?').run(id);
  }

// To delete todo by its id
  static delete(id) {
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  }
}

module.exports = Todo;