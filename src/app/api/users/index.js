import config from '../../config'

const USERS_URL = `${config.apiUrl}/users`

// Helper for handling fetch responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }
  return response.json()
}

// Get all users
export async function getUsers() {
  const response = await fetch(USERS_URL)
  return handleResponse(response)
}

// Get a single user by ID
export async function getUserById(id) {
  const response = await fetch(`${USERS_URL}/${id}`)
  return handleResponse(response)
}

// Create a new user
export async function createUser(userData) {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

// Update an existing user
export async function updateUser(id, userData) {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

// Delete a user
export async function deleteUser(id) {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
