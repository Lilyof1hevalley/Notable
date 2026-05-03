const FocusSession = require('../models/focusSessionModel');
const Todo = require('../models/todoModel');
const Note = require('../models/noteModel');
const Resource = require('../models/resourceModel');
const Notebook = require('../models/notebookModel');
const Folder = require('../models/folderModel');
const BHPSLogic = require('./bhpsLogic');

function getEffort(todo) {
  return Number(todo.estimated_effort) || 1;
}

function getLoadLabel(totalEffort) {
  if (totalEffort >= 14) return 'Heavy';
  if (totalEffort >= 7) return 'Moderate';
  return 'Light';
}

function parseDbDate(value) {
  if (!value) return null;

  const date = new Date(String(value).includes('T')
    ? value
    : `${String(value).replace(' ', 'T')}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function buildRecommendedBlock(userId, rankedTodos) {
  const topTodo = rankedTodos[0];
  if (!topTodo) return null;

  const notebooks = Notebook.findAllByUser(userId);
  const folders = Folder.findAllByUser(userId);
  const notebookById = new Map(notebooks.map((notebook) => [notebook.id, notebook]));
  const folderById = new Map(folders.map((folder) => [folder.id, folder]));

  const getFolderId = (todo) => {
    if (todo.folder_id) return todo.folder_id;
    return notebookById.get(todo.notebook_id)?.folder_id || null;
  };

  const topNotebook = notebookById.get(topTodo.notebook_id);
  const topFolderId = getFolderId(topTodo);
  const topFolder = folderById.get(topFolderId);
  const topic = topNotebook
    ? { type: 'notebook', id: topNotebook.id, title: topNotebook.title }
    : topFolder
      ? { type: 'folder', id: topFolder.id, title: topFolder.title }
      : { type: 'general', id: null, title: 'Today' };

  const relatedTodos = rankedTodos.filter((todo) => {
    if (todo.id === topTodo.id) return false;
    if (topTodo.notebook_id && todo.notebook_id === topTodo.notebook_id) return true;
    return topFolderId && getFolderId(todo) === topFolderId;
  });

  const selectedTodos = [topTodo];
  let totalEffort = getEffort(topTodo);

  relatedTodos.some((todo) => {
    if (selectedTodos.length >= 3) return true;
    const nextEffort = getEffort(todo);
    if (totalEffort + nextEffort > 18 && selectedTodos.length > 1) return false;
    selectedTodos.push(todo);
    totalEffort += nextEffort;
    return false;
  });

  const todoIds = new Set(selectedTodos.map((todo) => todo.id));
  const notes = Note.findAllByUser(userId)
    .filter((note) => note.todo_id && todoIds.has(note.todo_id))
    .slice(0, 4);

  const notebookIds = uniqueById(selectedTodos
    .map((todo) => notebookById.get(todo.notebook_id))
    .filter(Boolean))
    .map((notebook) => notebook.id);
  const resources = uniqueById(notebookIds.flatMap((notebookId) => (
    Resource.findByNotebookAndUser(notebookId, userId)
  ))).slice(0, 4);

  const steps = [
    {
      key: 'review',
      title: 'Review context',
      detail: notes.length || resources.length
        ? 'Skim linked notes and resources before starting the main task.'
        : 'Scan the notebook context and recall the goal before starting.',
    },
    {
      key: 'priority-task',
      title: 'Do the highest-impact task',
      detail: topTodo.title,
      todo_id: topTodo.id,
    },
  ];

  if (selectedTodos.length > 1) {
    steps.push({
      key: 'related-work',
      title: 'Continue related work',
      detail: selectedTodos.slice(1).map((todo) => todo.title).join(' / '),
    });
  }

  steps.push({
    key: 'reflect',
    title: 'Reflect briefly',
    detail: 'Capture one short note about what changed, what remains, and the next action.',
  });

  return {
    title: `${topic.title} focus block`,
    reason: `${topTodo.title} has the highest BHPS score, then related work is grouped to reduce context switching.`,
    duration_minutes: 50,
    topic,
    total_estimated_effort: totalEffort,
    cognitive_load: getLoadLabel(totalEffort),
    steps,
    todos: selectedTodos,
    notes,
    resources,
  };
}

function buildFocusSummary(sessionId, userId) {
  const session = FocusSession.findByIdAndUser(sessionId, userId);
  if (!session) return null;

  const rankedTodos = BHPSLogic.rankTodos(FocusSession.getSessionTodos(sessionId));
  const completedTodos = rankedTodos.filter((todo) => todo.is_completed === 1);
  const remainingTodos = rankedTodos.filter((todo) => todo.is_completed !== 1);
  const startedAt = parseDbDate(session.started_at);
  const endedAt = parseDbDate(session.ended_at) || new Date();
  const actualDurationMinutes = startedAt
    ? Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000))
    : 0;
  const totalEffort = rankedTodos.reduce((total, todo) => total + getEffort(todo), 0);
  const completedEffort = completedTodos.reduce((total, todo) => total + getEffort(todo), 0);
  const topRemainingTodo = remainingTodos[0] || null;

  return {
    session,
    planned_duration_minutes: Number(session.duration_minutes) || 50,
    actual_duration_minutes: actualDurationMinutes,
    total_todos: rankedTodos.length,
    completed_todos: completedTodos.length,
    remaining_todos: remainingTodos.length,
    completion_rate: rankedTodos.length
      ? Math.round((completedTodos.length / rankedTodos.length) * 100)
      : 0,
    total_estimated_effort: totalEffort,
    completed_estimated_effort: completedEffort,
    remaining_estimated_effort: Math.max(0, totalEffort - completedEffort),
    cognitive_load: getLoadLabel(totalEffort),
    todos: rankedTodos,
    next_action: topRemainingTodo
      ? {
        type: 'continue',
        title: `Continue ${topRemainingTodo.title}`,
        detail: 'This is the highest BHPS task still open from the focus block.',
        todo: topRemainingTodo,
      }
      : {
        type: 'next-block',
        title: 'Start the next BHPS block',
        detail: 'All tasks in this focus block are complete.',
        todo: null,
      },
  };
}

class FocusSessionController {
  // Start a new focus session
  static start(req, res) {
    try {
      const { duration_minutes } = req.body;
      const todoIds = Array.isArray(req.body.todo_ids) ? req.body.todo_ids : [];

      if (todoIds.length > 0) {
        const validTodos = todoIds.every(todoId => Todo.findByIdAndUser(todoId, req.userId));
        if (!validTodos) {
          return res.status(400).json({ message: 'One or more todos were not found!' });
        }
      }

      // Create session
      const sessionId = FocusSession.create(req.userId, duration_minutes || 50);

      // Add todos to session if provided
      if (todoIds.length > 0) {
        todoIds.forEach(todoId => {
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
      const summary = buildFocusSummary(req.params.id, req.userId);
      res.json({ message: 'Focus session ended!', summary });
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

      const summary = buildFocusSummary(req.params.id, req.userId);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get all sessions for user
  static getAll(req, res) {
    try {
      const sessions = FocusSession.findAllByUser(req.userId).map((session) => ({
        ...session,
        todos: BHPSLogic.rankTodos(FocusSession.getSessionTodos(session.id))
      }));
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
      const ranked = BHPSLogic.rankTodos(incompleteTodos);
      const recommendedBlock = buildRecommendedBlock(req.userId, ranked);

      res.json({
        message: 'Recommended todos for your focus session!',
        recommended_todos: ranked.slice(0, 5),
        recommended_block: recommendedBlock
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = FocusSessionController;
