const Folder = require('../models/folderModel');
const Notebook = require('../models/notebookModel');

class FolderController {
  // Get all folders for the logged-in user
  static getAll(req, res) {
    try {
      const folders = Folder.findAllByUser(req.userId);
      res.json({ folders });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create a new folder
  static create(req, res) {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required!' });
      }
      const folderId = Folder.create(req.userId, title);
      res.status(201).json({ message: 'Folder created!', folderId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a folder
  static update(req, res) {
    try {
      const { title } = req.body;
      const folder = Folder.findById(req.params.id);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found!' });
      }
      Folder.update(req.params.id, title);
      res.json({ message: 'Folder updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a folder
  static delete(req, res) {
    try {
      const folder = Folder.findById(req.params.id);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found!' });
      }
      Folder.delete(req.params.id);
      res.json({ message: 'Folder deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get all notebooks inside a folder
  static getNotebooks(req, res) {
    try {
      const folder = Folder.findById(req.params.id);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found!' });
      }
      const notebooks = Notebook.findByFolder(req.params.id);
      res.json({ notebooks });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = FolderController;