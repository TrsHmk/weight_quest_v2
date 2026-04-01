const API_BASE = '/api';
const TOKEN_KEY = 'wq_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

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
    throw Object.assign(new Error(data?.message || res.statusText), { status: res.status });
  }
  return data;
}

export const api = {
  login: async (email, password) => {
    const data = await request('POST', '/auth/login', { email, password });
    if (!data.user?.is_admin) throw new Error('Обліковий запис не має прав адміністратора');
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/admin/login';
  },
  admin: {
    stats: () => request('GET', '/admin/stats'),
    users: (page = 1, limit = 20) =>
      request('GET', `/admin/users?page=${page}&limit=${limit}`),
    user: (id) => request('GET', `/admin/users/${id}`),
  },
};
