const Chapter = require('../models/chapterModel');
const Notebook = require('../models/notebookModel');

class ChapterController {
  // Get all chapters in a notebook
  static getAll(req, res) {
    try {
      const notebook = Notebook.findById(req.params.notebookId);
      if (!notebook) {
        return res.status(404).json({ message: 'Notebook not found!' });
      }

      const chapters = Chapter.findAllByNotebook(req.params.notebookId);
      res.json({ chapters });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Create a new chapter
  static create(req, res) {
    try {
      const { title, content } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required!' });
      }

      const notebook = Notebook.findById(req.params.notebookId);
      if (!notebook) {
        return res.status(404).json({ message: 'Notebook not found!' });
      }

      const chapterId = Chapter.create(req.params.notebookId, req.userId, title, content || '');
      res.status(201).json({ message: 'Chapter created!', chapterId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a chapter
  static update(req, res) {
    try {
      const { title, content } = req.body;

      const chapter = Chapter.findById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found!' });
      }

      Chapter.update(req.params.id, title, content);
      res.json({ message: 'Chapter updated!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a chapter
  static delete(req, res) {
    try {
      const chapter = Chapter.findById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found!' });
      }

      Chapter.delete(req.params.id);
      res.json({ message: 'Chapter deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = ChapterController;