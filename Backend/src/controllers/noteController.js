const Note = require('../models/noteModel');

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
      const { title, content, todo_id } = req.body;
      const noteId = Note.create(req.userId, title, content, todo_id || null);
      res.status(201).json({ message: 'Note created!', noteId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a note
  static update(req, res) {
    try {
      const { title, content } = req.body;
      Note.update(req.params.id, title, content);
      res.json({ message: 'Note updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a note
  static delete(req, res) {
    try {
      Note.delete(req.params.id);
      res.json({ message: 'Note deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = NoteController;