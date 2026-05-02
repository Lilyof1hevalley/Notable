const db = require('../../database/db');
const { randomUUID } = require('crypto');

class FocusSession {
  // Create a new focus session
  static create(userId, durationMinutes) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO focus_sessions (id, user_id, duration_minutes)
      VALUES (?, ?, ?)
    `).run(id, userId, durationMinutes);
    return id;
  }

  // End a focus session
  static end(id) {
    db.prepare(`
      UPDATE focus_sessions 
      SET ended_at = CURRENT_TIMESTAMP, is_completed = 1
      WHERE id = ?
    `).run(id);
  }

  // Add todo to focus session
  static addTodo(sessionId, todoId) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO session_todos (id, session_id, todo_id)
      VALUES (?, ?, ?)
    `).run(id, sessionId, todoId);
  }

  // Get all todos in a session
  static getSessionTodos(sessionId) {
    return db.prepare(`
      SELECT t.* FROM todos t
      JOIN session_todos st ON t.id = st.todo_id
      WHERE st.session_id = ?
    `).all(sessionId);
  }

  // Get session by ID
  static findById(id) {
    return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(id);
  }

  // Get all sessions for a user
  static findAllByUser(userId) {
    return db.prepare(`
      SELECT * FROM focus_sessions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);
  }

  // Get session summary
  static getSummary(sessionId) {
    const session = FocusSession.findById(sessionId);
    const todos = FocusSession.getSessionTodos(sessionId);
    const completedTodos = todos.filter(t => t.is_completed === 1);

    return {
      session,
      total_todos: todos.length,
      completed_todos: completedTodos.length,
      todos
    };
  }
}

module.exports = FocusSession;