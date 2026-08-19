// Centralized application configuration
const config = Object.freeze({
  appName: import.meta.env.VITE_APP_NAME || 'Attendance Application',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
})

export default config
