const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const TodoController = require('../controllers/todoController');
const NoteController = require('../controllers/noteController');
const PasswordController = require('../controllers/passwordController');
const FocusSessionController = require('../controllers/focusSessionController');
const authMiddleware = require('../utils/authMiddleware');
const { validate, registerRules, loginRules, todoRules, noteRules } = require('../utils/validator');
const { authLimiter } = require('../utils/rateLimiter');

// Auth routes (public)
router.post('/auth/register', authLimiter, registerRules, validate, AuthController.register);
router.post('/auth/login', authLimiter, loginRules, validate, AuthController.login);

// Password reset routes (public)
router.post('/auth/forgot-password', authLimiter, PasswordController.forgotPassword);
router.post('/auth/reset-password', PasswordController.resetPassword);

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

module.exports = router;