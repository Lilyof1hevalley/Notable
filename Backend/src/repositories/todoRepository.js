const db = require('../db');
const { randomUUID } = require('crypto');

class Todo {
  // Create a new todo for a user
  static create(userId, title, deadline, academicWeight, estimatedEffort, folderId = null, notebookId = null, reminderAt = null) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO todos (id, user_id, title, deadline, folder_id, notebook_id, academic_weight, estimated_effort, reminder_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, title, deadline, folderId, notebookId, academicWeight, estimatedEffort, reminderAt);
    return id;
  }

  // Get all todos belonging to a specific user
  static findAllByUser(userId) {
    return db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  // Search todos by title
  static search(userId, query) {
    return db.prepare(`
      SELECT * FROM todos 
      WHERE user_id = ? AND title LIKE ?
      ORDER BY created_at DESC
    `).all(userId, `%${query}%`);
  }

  // Filter todos by completion status
  static filterByStatus(userId, isCompleted) {
    return db.prepare(`
      SELECT * FROM todos 
      WHERE user_id = ? AND is_completed = ?
      ORDER BY created_at DESC
    `).all(userId, isCompleted);
  }

  // Get todos with pagination
  static findWithPagination(userId, limit, offset) {
    return db.prepare(`
      SELECT * FROM todos 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);
  }

  // Count total todos for a user
  static countByUser(userId) {
    return db.prepare('SELECT COUNT(*) as total FROM todos WHERE user_id = ?').get(userId);
  }

  static withNoteCounts(userId, todos) {
    if (!todos.length) return todos;

    const todoIds = todos.map((todo) => todo.id);
    const placeholders = todoIds.map(() => '?').join(',');
    const noteCounts = db.prepare(`
      SELECT todo_id, COUNT(*) AS note_count
      FROM notes
      WHERE user_id = ? AND todo_id IN (${placeholders})
      GROUP BY todo_id
    `).all(userId, ...todoIds);
    const countByTodoId = new Map(noteCounts.map((row) => [String(row.todo_id), row.note_count]));

    return todos.map((todo) => ({
      ...todo,
      note_count: countByTodoId.get(String(todo.id)) || 0
    }));
  }

  // Find a single todo by its ID
  static findById(id) {
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  }

  static findByIdAndUser(id, userId) {
    return db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, userId);
  }

  // Update todo details
  static update(id, userId, title, deadline, academicWeight, estimatedEffort, folderId = null, notebookId = null, reminderAt = null) {
    db.prepare(`
      UPDATE todos
      SET title = ?, deadline = ?, folder_id = ?, notebook_id = ?, academic_weight = ?, estimated_effort = ?, reminder_at = ?
      WHERE id = ? AND user_id = ?
    `).run(title, deadline, folderId, notebookId, academicWeight, estimatedEffort, reminderAt, id, userId);
  }

  // Mark a todo as completed
  static markComplete(id, userId) {
    db.prepare('UPDATE todos SET is_completed = 1 WHERE id = ? AND user_id = ?').run(id, userId);
  }

  // Delete a todo by ID
  static delete(id, userId) {
    const deleteTodo = db.transaction(() => {
      db.prepare('UPDATE notes SET todo_id = NULL WHERE todo_id = ? AND user_id = ?').run(id, userId);
      db.prepare('DELETE FROM session_todos WHERE todo_id = ?').run(id);
      db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(id, userId);
    });

    deleteTodo();
  }
}

module.exports = Todo;
