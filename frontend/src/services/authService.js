
import apiClient from './apiClient';

let csrfToken = null;

function getResponseData(response) {
  const body = response.data;

  if (body?.success === false) {
    throw new Error(body.message || 'Request failed.');
  }

  return body?.data ?? body;
}

function setCsrfToken(token) {
  csrfToken = token || null;

  if (csrfToken) {
    apiClient.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  } else {
    delete apiClient.defaults.headers.common['X-CSRF-Token'];
  }
}

function getUser(data) {
  const user = data?.user ?? data;

  if (!user || !user.role) {
    throw new Error('Invalid user response from server.');
  }

  return user;
}

const authService = {
  async login(identifier, password) {
    const response = await apiClient.post('/auth/login.php', {
      identifier,
      password,
    });

    const data = getResponseData(response);
    setCsrfToken(data.csrf_token);

    return getUser(data);
  },

  async register(formData) {
    const response = await apiClient.post('/auth/register.php', formData);

    const data = getResponseData(response);
    setCsrfToken(data.csrf_token);

    return getUser(data);
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me.php');

    const data = getResponseData(response);
    setCsrfToken(data.csrf_token);

    return getUser(data);
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout.php');
    } finally {
      setCsrfToken(null);
    }
  },

  clearCsrfToken() {
    setCsrfToken(null);
  },
};

export default authService;
