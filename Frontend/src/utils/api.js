const BASE_URL = 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  const raw = localStorage.getItem('user')
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

async function request(path, options = {}) {
  const token = getToken()
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`)
  }
  return data
}

export const api = {
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Todos
  getTodos: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/todos${qs ? '?' + qs : ''}`)
  },
  createTodo: (body) => request('/todos', { method: 'POST', body: JSON.stringify(body) }),
  updateTodo: (id, body) => request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  completeTodo: (id) => request(`/todos/${id}/complete`, { method: 'PATCH' }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),

  // Notes
  getNotes: () => request('/notes'),
  createNote: (body) => request('/notes', { method: 'POST', body: JSON.stringify(body) }),
  updateNote: (id, body) => request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // Focus sessions
  getFocusSessions: () => request('/focus-sessions'),
  getRecommended: () => request('/focus-sessions/recommended'),
  startFocusSession: (body) => request('/focus-sessions', { method: 'POST', body: JSON.stringify(body) }),
  endFocusSession: (id) => request(`/focus-sessions/${id}/end`, { method: 'PATCH' }),
  getFocusSummary: (id) => request(`/focus-sessions/${id}/summary`),
}