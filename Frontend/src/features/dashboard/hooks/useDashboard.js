import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../../lib/api'
import { getDefaultReminderAt, getReminderMeta, toIsoOrNull } from '../../../utils/reminders'

const EMPTY_TODO = {
  title: '',
  deadline: '',
  academic_weight: '5',
  estimated_effort: '3',
  folder_id: '',
  notebook_id: '',
  reminder_at: '',
}

export const DASHBOARD_MODAL = {
  FOLDER: 'folder',
  NOTEBOOK: 'notebook',
  TODO: 'todo',
  GCAL: 'gcal',
}

function getDefaultState(user) {
  return {
    folders: [],
    notebooks: [],
    profile: user,
    recommendedBlock: null,
    recommendedTodos: [],
    sessions: [],
    todos: [],
  }
}

function todoMatchesStatus(todo, statusFilter) {
  if (statusFilter === 'active') return todo.is_completed === 0
  if (statusFilter === 'completed') return todo.is_completed === 1
  return true
}

export function useDashboard(auth) {
  const { updateUser } = auth
  const [data, setData] = useState(() => getDefaultState(auth.user))
  const [folderTitle, setFolderTitle] = useState('')
  const [notebookTitle, setNotebookTitle] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')
  const [todoForm, setTodoForm] = useState(EMPTY_TODO)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortMode, setSortMode] = useState('newest')
  const [activeModal, setActiveModal] = useState(null)
  const [isTimerMinimized, setIsTimerMinimized] = useState(false)
  const [lastFocusSummary, setLastFocusSummary] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    setError('')
    try {
      const [
        profileData,
        foldersData,
        notebooksData,
        todosData,
        recommendedData,
        sessionsData,
      ] = await Promise.all([
        apiRequest('/user/profile'),
        apiRequest('/folders'),
        apiRequest('/notebooks'),
        apiRequest('/todos?limit=100'),
        apiRequest('/focus-sessions/recommended'),
        apiRequest('/focus-sessions'),
      ])

      updateUser(profileData.user)
      setData({
        folders: foldersData.folders || [],
        notebooks: notebooksData.notebooks || [],
        profile: profileData.user,
        recommendedBlock: recommendedData.recommended_block || null,
        recommendedTodos: recommendedData.recommended_todos || [],
        sessions: sessionsData.sessions || [],
        todos: todosData.todos || [],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [updateUser])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadDashboard()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadDashboard])

  const activeSession = useMemo(
    () => data.sessions.find((session) => session.is_completed === 0),
    [data.sessions],
  )

  const filteredTodosByStatus = useMemo(
    () => data.todos.filter((todo) => todoMatchesStatus(todo, statusFilter)),
    [data.todos, statusFilter],
  )

  const todoCountsByNotebookId = useMemo(() => {
    const counts = new Map()
    filteredTodosByStatus.forEach((todo) => {
      if (!todo.notebook_id) return
      counts.set(todo.notebook_id, (counts.get(todo.notebook_id) || 0) + 1)
    })
    return counts
  }, [filteredTodosByStatus])

  const todoCountsByFolderId = useMemo(() => {
    const notebookFolderIds = new Map(
      data.notebooks.map((notebook) => [notebook.id, notebook.folder_id]),
    )
    const counts = new Map()

    filteredTodosByStatus.forEach((todo) => {
      const folderId = todo.folder_id || notebookFolderIds.get(todo.notebook_id)
      if (!folderId) return
      counts.set(folderId, (counts.get(folderId) || 0) + 1)
    })

    return counts
  }, [data.notebooks, filteredTodosByStatus])

  const visibleWorkspaceItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const folderItems = data.folders.map((folder) => ({
      ...folder,
      type: 'folder',
      taskCount: todoCountsByFolderId.get(folder.id) || 0,
    }))
    const notebookItems = data.notebooks.map((notebook) => ({
      ...notebook,
      type: 'notebook',
      taskCount: todoCountsByNotebookId.get(notebook.id) || 0,
    }))

    return [...folderItems, ...notebookItems]
      .filter((item) => typeFilter === 'all' || item.type === typeFilter)
      .filter((item) => !query || item.title.toLowerCase().includes(query))
      .sort((first, second) => {
        if (sortMode === 'az') return first.title.localeCompare(second.title)
        if (sortMode === 'mostTodos') return second.taskCount - first.taskCount || first.title.localeCompare(second.title)
        if (sortMode === 'leastTodos') return first.taskCount - second.taskCount || first.title.localeCompare(second.title)
        return new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
      })
  }, [
    data.folders,
    data.notebooks,
    search,
    sortMode,
    todoCountsByFolderId,
    todoCountsByNotebookId,
    typeFilter,
  ])

  const visibleTimelineTodos = useMemo(() => {
    const query = search.trim().toLowerCase()
    return filteredTodosByStatus.filter((todo) => (
      !query || todo.title.toLowerCase().includes(query)
    ))
  }, [filteredTodosByStatus, search])

  const reminderTodos = useMemo(() => {
    const now = new Date()
    return data.todos
      .filter((todo) => todo.is_completed === 0)
      .map((todo) => ({
        ...todo,
        reminderMeta: getReminderMeta(todo, now),
      }))
      .filter((todo) => todo.reminderMeta.tone !== 'none')
      .sort((first, second) => (
        first.reminderMeta.rank - second.reminderMeta.rank
        || new Date(first.reminder_at || first.deadline).getTime() - new Date(second.reminder_at || second.deadline).getTime()
      ))
      .slice(0, 6)
  }, [data.todos])

  const runMutation = useCallback(async (mutation, successMessage, afterSuccess) => {
    setError('')
    setMessage('')
    try {
      await mutation()
      afterSuccess?.()
      setMessage(successMessage)
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }, [loadDashboard])

  const closeModal = useCallback(() => setActiveModal(null), [])
  const clearFocusSummary = useCallback(() => setLastFocusSummary(null), [])
  const openModal = useCallback((modal) => setActiveModal(modal), [])

  const submitFolder = useCallback((event) => {
    event.preventDefault()
    return runMutation(
      () => apiRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({ title: folderTitle }),
      }),
      'Folder created.',
      () => {
        setFolderTitle('')
        closeModal()
      },
    )
  }, [closeModal, folderTitle, runMutation])

  const submitNotebook = useCallback((event) => {
    event.preventDefault()
    return runMutation(
      () => apiRequest('/notebooks', {
        method: 'POST',
        body: JSON.stringify({ title: notebookTitle, folder_id: selectedFolder || null }),
      }),
      'Notebook created.',
      () => {
        setNotebookTitle('')
        setSelectedFolder('')
        closeModal()
      },
    )
  }, [closeModal, notebookTitle, runMutation, selectedFolder])

  const submitTodo = useCallback((event) => {
    event.preventDefault()
    return runMutation(
      () => apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: todoForm.title,
          deadline: todoForm.deadline,
          folder_id: todoForm.folder_id || null,
          notebook_id: todoForm.notebook_id || null,
          academic_weight: Number(todoForm.academic_weight),
          estimated_effort: Number(todoForm.estimated_effort),
          reminder_at: toIsoOrNull(todoForm.reminder_at) || toIsoOrNull(getDefaultReminderAt(todoForm.deadline)),
        }),
      }),
      'Todo created.',
      () => {
        setTodoForm(EMPTY_TODO)
        closeModal()
      },
    )
  }, [closeModal, runMutation, todoForm])

  const completeTodo = useCallback((todoId) => runMutation(
    () => apiRequest(`/todos/${todoId}/complete`, { method: 'PATCH' }),
    'Todo completed.',
  ), [runMutation])

  const deleteTodo = useCallback((todoId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return undefined

    return runMutation(
      () => apiRequest(`/todos/${todoId}`, { method: 'DELETE' }),
      'Todo deleted.',
    )
  }, [runMutation])

  const deleteNotebook = useCallback((notebookId) => {
    if (!window.confirm('Are you sure you want to delete this notebook?')) return undefined

    return runMutation(
      () => apiRequest(`/notebooks/${notebookId}`, { method: 'DELETE' }),
      'Notebook deleted.',
    )
  }, [runMutation])

  const startFocus = useCallback((todoIds) => {
    const normalizedTodoIds = Array.isArray(todoIds)
      ? todoIds.filter(Boolean)
      : todoIds
        ? [todoIds]
        : []

    return runMutation(
      () => apiRequest('/focus-sessions', {
        method: 'POST',
        body: JSON.stringify({ duration_minutes: 50, todo_ids: normalizedTodoIds }),
      }),
      'Focus session started.',
      () => setLastFocusSummary(null),
    )
  }, [runMutation])

  const endFocus = useCallback(async (sessionId) => {
    setError('')
    setMessage('')

    try {
      const response = await apiRequest(`/focus-sessions/${sessionId}/end`, { method: 'PATCH' })
      setIsTimerMinimized(false)
      setLastFocusSummary(response.summary || null)
      setMessage('Focus session ended.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }, [loadDashboard])

  return {
    activeModal,
    activeSession,
    clearFocusSummary,
    closeModal,
    completeTodo,
    data,
    deleteNotebook,
    deleteTodo,
    endFocus,
    error,
    folderTitle,
    isLoading,
    isTimerMinimized,
    lastFocusSummary,
    message,
    notebookTitle,
    openModal,
    selectedFolder,
    search,
    setFolderTitle,
    setIsTimerMinimized,
    setNotebookTitle,
    setSearch,
    setSelectedFolder,
    setSortMode,
    setStatusFilter,
    setTodoForm,
    setTypeFilter,
    sortMode,
    startFocus,
    statusFilter,
    submitFolder,
    submitNotebook,
    submitTodo,
    todoForm,
    typeFilter,
    reminderTodos,
    visibleTimelineTodos,
    visibleWorkspaceItems,
  }
}
