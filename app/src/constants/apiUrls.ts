const PORT = import.meta.env.VITE_BACKEND_PORT || 3002;

const API_URLS = {
  USER_SIGNUP: `http://localhost:${PORT}/api/users/signup`,
  USER_LOGIN: `http://localhost:${PORT}/api/users/login`,
  USER_UPDATE_USER: `http://localhost:${PORT}/api/users`,
  USER_DELETE_USER: `http://localhost:${PORT}/api/users`,
  USER_FILTER_EVENTS: `http://localhost:${PORT}/api/users/events/filter`,
  USER_GET_SPECIFIC_EVENT: `http://localhost:${PORT}/api/users/event`,
  USER_GET_EVENTS: `http://localhost:${PORT}/api/users/events`,
  USER_CREATE_EVENT: `http://localhost:${PORT}/api/users/events`,
  USER_UPDATE_EVENT: `http://localhost:${PORT}/api/users/events`,
  USER_DELETE_EVENT: `http://localhost:${PORT}/api/users/events`,
  USER_REGISTER_EVENT: `http://localhost:${PORT}/api/users/events/register`,
  GET_ALL_EVENTS: `http://localhost:${PORT}/api/admin/events`,
  ADMIN_GET_ALL_USERS: `http://localhost:${PORT}/api/admin/users`,
  CHATBOT_SUGGEST_EVENTS: `http://localhost:${PORT}/api/chatbot/suggest-events`,
  ADMIN_REPORTED_EVENTS: `http://localhost:${PORT}/api/admin/reported-events`,
  FILTERS_API: `http://localhost:${PORT}/api/users/events/filter`
};

export default API_URLS;
