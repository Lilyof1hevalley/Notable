const Todo = require('../models/todoModel');
const BHPSLogic = require('./bhpsLogic');

class TodoController {
  // Get all todos with BHPS score, search, filter, and pagination
  static getAll(req, res) {
    try {
      const { search, status, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let todos;

      // Search by title
      if (search) {
        todos = Todo.search(req.userId, search);
      }
      // Filter by status (completed/incomplete)
      else if (status !== undefined) {
        const isCompleted = status === 'completed' ? 1 : 0;
        todos = Todo.filterByStatus(req.userId, isCompleted);
      }
      // Get all with pagination
      else {
        todos = Todo.findWithPagination(req.userId, parseInt(limit), parseInt(offset));
      }

      // Get total count for pagination info
      const { total } = Todo.countByUser(req.userId);

      // Rank todos by BHPS score
      const rankedTodos = BHPSLogic.rankTodos(todos);

      res.json({
        todos: rankedTodos,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create a new todo
  static create(req, res) {
    try {
      const { title, deadline, academic_weight, estimated_effort } = req.body;
      const todoId = Todo.create(
        req.userId,
        title,
        deadline,
        academic_weight || 1.0,
        estimated_effort || 1.0
      );
      res.status(201).json({ message: 'Todo created!', todoId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a todo
  static update(req, res) {
    try {
      const { title, deadline, academic_weight, estimated_effort } = req.body;
      
      // Check if todo exists
      const todo = Todo.findByIdAndUser(req.params.id, req.userId);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found!' });
      }

      Todo.update(req.params.id, req.userId, title, deadline, academic_weight, estimated_effort);
      res.json({ message: 'Todo updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Mark a todo as complete
  static markComplete(req, res) {
    try {
      // Check if todo exists
      const todo = Todo.findByIdAndUser(req.params.id, req.userId);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found!' });
      }

      Todo.markComplete(req.params.id, req.userId);
      res.json({ message: 'Todo marked as complete!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a todo
  static delete(req, res) {
    try {
      // Check if todo exists
      const todo = Todo.findByIdAndUser(req.params.id, req.userId);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found!' });
      }

      Todo.delete(req.params.id, req.userId);
      res.json({ message: 'Todo deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

}

module.exports = TodoController;
