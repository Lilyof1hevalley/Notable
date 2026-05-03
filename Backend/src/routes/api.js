const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const TodoController = require('../controllers/todoController');
const NoteController = require('../controllers/noteController');
const PasswordController = require('../controllers/passwordController');
const FocusSessionController = require('../controllers/focusSessionController');
const UserController = require('../controllers/userController');
const FolderController = require('../controllers/folderController');
const NotebookController = require('../controllers/notebookController');
const ChapterController = require('../controllers/chapterController');
const ResourceController = require('../controllers/resourceController');
const GoogleCalendarController = require('../controllers/googleCalendarController');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/uploadMiddleware');
const { validate, registerRules, loginRules, todoRules, noteRules } = require('../utils/validator');
const { authLimiter } = require('../utils/rateLimiter');

// Auth routes (public)
router.post('/auth/register', authLimiter, registerRules, validate, AuthController.register);
router.post('/auth/login', authLimiter, loginRules, validate, AuthController.login);

// Password reset routes (public)
router.post('/auth/forgot-password', authLimiter, PasswordController.forgotPassword);
router.post('/auth/reset-password', PasswordController.resetPassword);

// User profile routes (protected)
router.get('/user/profile', authMiddleware, UserController.getProfile);
router.patch('/user/profile', authMiddleware, UserController.updateProfile);
router.patch('/user/password', authMiddleware, UserController.changePassword);

// Todo routes (protected)
router.get('/todos', authMiddleware, TodoController.getAll);
router.post('/todos', authMiddleware, todoRules, validate, TodoController.create);
router.patch('/todos/:id', authMiddleware, todoRules, validate, TodoController.update);
router.patch('/todos/:id/complete', authMiddleware, TodoController.markComplete);
router.delete('/todos/:id', authMiddleware, TodoController.delete);

// Note routes (protected)
router.get('/notes', authMiddleware, NoteController.getAll);
router.post('/notes', authMiddleware, noteRules, validate, NoteController.create);
router.patch('/notes/:id', authMiddleware, noteRules, validate, NoteController.update);
router.delete('/notes/:id', authMiddleware, NoteController.delete);

// Focus session routes (protected)
router.get('/focus-sessions', authMiddleware, FocusSessionController.getAll);
router.get('/focus-sessions/recommended', authMiddleware, FocusSessionController.getRecommended);
router.post('/focus-sessions', authMiddleware, FocusSessionController.start);
router.patch('/focus-sessions/:id/end', authMiddleware, FocusSessionController.end);
router.get('/focus-sessions/:id/summary', authMiddleware, FocusSessionController.getSummary);

// Folder routes (protected)
router.get('/folders', authMiddleware, FolderController.getAll);
router.post('/folders', authMiddleware, FolderController.create);
router.patch('/folders/:id', authMiddleware, FolderController.update);
router.delete('/folders/:id', authMiddleware, FolderController.delete);
router.get('/folders/:id/notebooks', authMiddleware, FolderController.getNotebooks);

// Notebook routes (protected)
router.get('/notebooks', authMiddleware, NotebookController.getAll);
router.post('/notebooks', authMiddleware, NotebookController.create);
router.patch('/notebooks/:id', authMiddleware, NotebookController.update);
router.delete('/notebooks/:id', authMiddleware, NotebookController.delete);

// Chapter routes (protected)
router.get('/notebooks/:notebookId/chapters', authMiddleware, ChapterController.getAll);
router.post('/notebooks/:notebookId/chapters', authMiddleware, ChapterController.create);
router.patch('/chapters/:id', authMiddleware, ChapterController.update);
router.delete('/chapters/:id', authMiddleware, ChapterController.delete);

// Resource routes (protected)
router.get('/resources', authMiddleware, ResourceController.getAll);
router.post('/resources', authMiddleware, upload.single('file'), ResourceController.upload);
router.get('/resources/notebook/:notebookId', authMiddleware, ResourceController.getByNotebook);
router.get('/resources/chapter/:chapterId', authMiddleware, ResourceController.getByChapter);
router.get('/resources/:id/download', authMiddleware, ResourceController.download);
router.delete('/resources/:id', authMiddleware, ResourceController.delete);

// Google Calendar routes (protected)
router.get('/calendar/auth', authMiddleware, GoogleCalendarController.getAuthUrl);
router.get('/calendar/callback', GoogleCalendarController.handleCallback);
router.get('/calendar/events', authMiddleware, GoogleCalendarController.getEvents);

module.exports = router;
