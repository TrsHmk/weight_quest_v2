const API_BASE = '/api';
const TOKEN_KEY = 'wq_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = Object.assign(new Error(data?.message || res.statusText), {
      status: res.status,
      data,
    });
    throw err;
  }
  return data;
}

function createEntityClient(name) {
  return {
    list: (sort, limit) => {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (limit) params.set('limit', String(limit));
      const qs = params.toString();
      return request('GET', `/entities/${name}${qs ? '?' + qs : ''}`);
    },
    get: (id) => request('GET', `/entities/${name}/${id}`),
    create: (data) => request('POST', `/entities/${name}`, data),
    update: (id, data) => request('PUT', `/entities/${name}/${id}`, data),
    delete: (id) => request('DELETE', `/entities/${name}/${id}`),
  };
}

export const base44 = {
  api: {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
  },
  auth: {
    me: () => request('GET', '/auth/me'),
    logout: (redirectUrl) => {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = redirectUrl || '/login';
    },
    redirectToLogin: (returnUrl) => {
      const from = returnUrl ? `?from=${encodeURIComponent(returnUrl)}` : '';
      window.location.href = `/login${from}`;
    },
    login: async (email, password) => {
      const data = await request('POST', '/auth/login', { email, password });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
    register: async (email, password, username) => {
      const data = await request('POST', '/auth/register', { email, password, username });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
  },
  entities: {
    PlayerProfile: createEntityClient('PlayerProfile'),
    DailyLog: createEntityClient('DailyLog'),
  },
};
