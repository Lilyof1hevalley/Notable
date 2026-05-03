const Todo = require('../models/todoModel');
const Folder = require('../models/folderModel');
const Notebook = require('../models/notebookModel');
const BHPSLogic = require('./bhpsLogic');

function resolveTodoTarget(req, res) {
  const folderId = req.body.folder_id || null;
  const notebookId = req.body.notebook_id || null;

  if (folderId && notebookId) {
    res.status(400).json({ message: 'Choose either a folder or a notebook, not both.' });
    return null;
  }

  if (folderId && !Folder.findByIdAndUser(folderId, req.userId)) {
    res.status(404).json({ message: 'Folder not found!' });
    return null;
  }

  if (notebookId && !Notebook.findByIdAndUser(notebookId, req.userId)) {
    res.status(404).json({ message: 'Notebook not found!' });
    return null;
  }

  return { folderId, notebookId };
}

function getDefaultReminderAt(deadline) {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const reminderDate = new Date(deadlineDate.getTime() - (24 * 60 * 60 * 1000));
  const now = new Date();
  return (reminderDate < now ? now : reminderDate).toISOString();
}

function resolveReminderAt(deadline, reminderAt) {
  if (reminderAt === null) return null;
  if (reminderAt === '') return getDefaultReminderAt(deadline);
  if (reminderAt) return new Date(reminderAt).toISOString();
  return getDefaultReminderAt(deadline);
}

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
      const { title, deadline, academic_weight, estimated_effort, reminder_at } = req.body;
      const target = resolveTodoTarget(req, res);
      if (!target) return;
      const reminderAt = resolveReminderAt(deadline, reminder_at);

      const todoId = Todo.create(
        req.userId,
        title,
        deadline,
        academic_weight || 1.0,
        estimated_effort || 1.0,
        target.folderId,
        target.notebookId,
        reminderAt
      );
      res.status(201).json({ message: 'Todo created!', todoId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a todo
  static update(req, res) {
    try {
      const { title, deadline, academic_weight, estimated_effort, reminder_at } = req.body;
      const target = resolveTodoTarget(req, res);
      if (!target) return;
      
      // Check if todo exists
      const todo = Todo.findByIdAndUser(req.params.id, req.userId);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found!' });
      }

      Todo.update(
        req.params.id,
        req.userId,
        title,
        deadline,
        academic_weight,
        estimated_effort,
        target.folderId,
        target.notebookId,
        resolveReminderAt(deadline, reminder_at)
      );
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
