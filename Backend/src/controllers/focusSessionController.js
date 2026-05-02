const FocusSession = require('../models/focusSessionModel');
const Todo = require('../models/todoModel');
const BHPSLogic = require('./bhpsLogic');

class FocusSessionController {
  // Start a new focus session
  static start(req, res) {
    try {
      const { duration_minutes, todo_ids } = req.body;

      if (todo_ids && todo_ids.length > 0) {
        const validTodos = todo_ids.every(todoId => Todo.findByIdAndUser(todoId, req.userId));
        if (!validTodos) {
          return res.status(400).json({ message: 'One or more todos were not found!' });
        }
      }

      // Create session
      const sessionId = FocusSession.create(req.userId, duration_minutes || 50);

      // Add todos to session if provided
      if (todo_ids && todo_ids.length > 0) {
        todo_ids.forEach(todoId => {
          FocusSession.addTodo(sessionId, todoId);
        });
      }

      res.status(201).json({
        message: 'Focus session started!',
        sessionId,
        duration_minutes: duration_minutes || 50
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // End a focus session
  static end(req, res) {
    try {
      const session = FocusSession.findByIdAndUser(req.params.id, req.userId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found!' });
      }

      FocusSession.end(req.params.id);
      res.json({ message: 'Focus session ended!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get session summary
  static getSummary(req, res) {
    try {
      const session = FocusSession.findByIdAndUser(req.params.id, req.userId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found!' });
      }

      const summary = FocusSession.getSummary(req.params.id, req.userId);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get all sessions for user
  static getAll(req, res) {
    try {
      const sessions = FocusSession.findAllByUser(req.userId);
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get recommended todos for a focus session based on BHPS
  static getRecommended(req, res) {
    try {
      const todos = Todo.findAllByUser(req.userId);

      // Filter incomplete todos only
      const incompleteTodos = todos.filter(t => t.is_completed === 0);

      // Rank by BHPS and take top 5
      const ranked = BHPSLogic.rankTodos(incompleteTodos).slice(0, 5);

      res.json({
        message: 'Recommended todos for your focus session!',
        recommended_todos: ranked
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = FocusSessionController;
