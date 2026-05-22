const Note = require('../repositories/noteRepository');
const Notebook = require('../repositories/notebookRepository');
const Todo = require('../repositories/todoRepository');

function resolveNoteTarget(userId, { notebook_id: notebookId, todo_id: todoId }) {
  if (notebookId && !Notebook.findByIdAndUser(notebookId, userId)) {
    return { error: { status: 404, body: { message: 'Notebook not found!' } } };
  }

  if (todoId) {
    const todo = Todo.findByIdAndUser(todoId, userId);
    if (!todo) {
      return { error: { status: 404, body: { message: 'Todo not found!' } } };
    }

    if (notebookId && todo.notebook_id && String(todo.notebook_id) !== String(notebookId)) {
      return { error: { status: 400, body: { message: 'Todo does not belong to this notebook.' } } };
    }
  }

  return { notebookId: notebookId || null, todoId: todoId || null };
}

class NoteController {
  // Get all notes for the logged-in user
  static getAll(req, res) {
    try {
      const notes = Note.findAllByUser(req.userId);
      res.json({ notes });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create a new note
  static create(req, res) {
    try {
      const { title, content } = req.body;
      const target = resolveNoteTarget(req.userId, req.body);
      if (target.error) {
        return res.status(target.error.status).json(target.error.body);
      }

      const noteId = Note.create(req.userId, title, content, target.notebookId, target.todoId);
      res.status(201).json({ message: 'Note created!', noteId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a note
  static update(req, res) {
    try {
      const { title, content } = req.body;
      const note = Note.findByIdAndUser(req.params.id, req.userId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found!' });
      }

      const target = resolveNoteTarget(req.userId, {
        notebook_id: note.notebook_id,
        todo_id: Object.prototype.hasOwnProperty.call(req.body, 'todo_id')
          ? req.body.todo_id || null
          : note.todo_id
      });
      if (target.error) {
        return res.status(target.error.status).json(target.error.body);
      }

      Note.update(req.params.id, req.userId, title, content, target.todoId);
      res.json({ message: 'Note updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a note
  static delete(req, res) {
    try {
      const note = Note.findByIdAndUser(req.params.id, req.userId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found!' });
      }
      Note.delete(req.params.id, req.userId);
      res.json({ message: 'Note deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = NoteController;
