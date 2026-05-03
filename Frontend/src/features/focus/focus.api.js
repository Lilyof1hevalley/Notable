import { apiRequest } from '../../shared/api/api'

export function getFocusSessions() {
  return apiRequest('/focus-sessions')
}

export function getFocusRecommendations() {
  return apiRequest('/focus-sessions/recommended')
}

export function startFocusSession(payload) {
  return apiRequest('/focus-sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function endFocusSession(sessionId) {
  return apiRequest(`/focus-sessions/${sessionId}/end`, { method: 'PATCH' })
}

export function completeFocusTodo(todoId) {
  return apiRequest(`/todos/${todoId}/complete`, { method: 'PATCH' })
}

export function getFocusNotes() {
  return apiRequest('/notes')
}

export function getFocusResources() {
  return apiRequest('/resources')
}
