const Notebook = require('../models/notebookModel');

class NotebookController {
  // Get all notebooks for the logged-in user
  static getAll(req, res) {
    try {
      const notebooks = Notebook.findAllByUser(req.userId);
      res.json({ notebooks });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create a new notebook
  static create(req, res) {
    try {
      const { title, folder_id } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required!' });
      }
      const notebookId = Notebook.create(req.userId, title, folder_id || null);
      res.status(201).json({ message: 'Notebook created!', notebookId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a notebook
  static update(req, res) {
    try {
      const { title, folder_id } = req.body;
      const notebook = Notebook.findById(req.params.id);
      if (!notebook) {
        return res.status(404).json({ message: 'Notebook not found!' });
      }
      Notebook.update(req.params.id, title, folder_id || null);
      res.json({ message: 'Notebook updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a notebook
  static delete(req, res) {
    try {
      const notebook = Notebook.findById(req.params.id);
      if (!notebook) {
        return res.status(404).json({ message: 'Notebook not found!' });
      }
      Notebook.delete(req.params.id);
      res.json({ message: 'Notebook deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = NotebookController;