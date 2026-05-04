// Frontend API client — drop this in src/utils/api.js

const BASE = 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    // Surface backend error message
    throw new Error(data.message || `Request failed: ${res.status}`)
  }

  return data
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password, display_name) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, display_name }) }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  // Todos
  getTodos: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/todos${qs ? '?' + qs : ''}`)
  },

  createTodo: (data) =>
    request('/todos', { method: 'POST', body: JSON.stringify(data) }),

  updateTodo: (id, data) =>
    request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  completeTodo: (id) =>
    request(`/todos/${id}/complete`, { method: 'PATCH' }),

  deleteTodo: (id) =>
    request(`/todos/${id}`, { method: 'DELETE' }),

  // Notes
  getNotes: () => request('/notes'),

  createNote: (data) =>
    request('/notes', { method: 'POST', body: JSON.stringify(data) }),

  updateNote: (id, data) =>
    request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteNote: (id) =>
    request(`/notes/${id}`, { method: 'DELETE' }),

  // Focus sessions
  getFocusSessions: () => request('/focus-sessions'),
  getRecommendedTodos: () => request('/focus-sessions/recommended'),
  startFocusSession: (data) =>
    request('/focus-sessions', { method: 'POST', body: JSON.stringify(data) }),
  endFocusSession: (id) =>
    request(`/focus-sessions/${id}/end`, { method: 'PATCH' }),
  getFocusSummary: (id) =>
    request(`/focus-sessions/${id}/summary`),
}

// Auth helpers
export function saveAuth(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function isLoggedIn() {
  return !!getToken()
}