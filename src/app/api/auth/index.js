import config from '../../config'

const AUTH_URL = `${config.apiUrl}/auth`

// Helper for handling fetch responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }
  return response.json()
}

// Login a user
export async function login(credentials) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  const data = await handleResponse(response)
  if (data.token) {
    localStorage.setItem('token', data.token)
  }
  return data
}

// Register a user
export async function register(userData) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

// Logout a user
export async function logout() {
  localStorage.removeItem('token')
  return { success: true }
}

// Get the current authenticated user
export async function getCurrentUser() {
  const token = localStorage.getItem('token')
  if (!token) return null
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse(response)
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
}
