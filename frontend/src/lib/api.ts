const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    profile: () => request('/auth/profile'),
  },
  apps: {
    list: (params?: { search?: string; type?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.type) q.set('type', params.type);
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return request(`/apps/list?${q.toString()}`);
    },
    featured: () => request('/apps/featured'),
    get: (id: number) => request(`/apps/${id}`),
    my: () => request('/apps/my'),
    upload: (formData: FormData) =>
      request('/apps/upload', { method: 'POST', body: formData }),
    delete: (id: number) => request(`/apps/${id}`, { method: 'DELETE' }),
    downloadUrl: (id: number) => `${API_URL}/apps/${id}/download`,
  },
  device: {
    report: (data: Record<string, unknown>) =>
      request('/device/report', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/device/list'),
    delete: (id: number) => request(`/device/${id}`, { method: 'DELETE' }),
  },
  admin: {
    listUsers: () => request('/admin/users'),
    createUser: (body: { username: string; email: string; password: string }) =>
      request('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
    updateRole: (id: number, role: string) =>
      request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    toggleBan: (id: number) =>
      request(`/admin/users/${id}/ban`, { method: 'PATCH' }),
    updateCredentials: (id: number, data: { username?: string; email?: string; password?: string }) =>
      request(`/admin/users/${id}/credentials`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteUser: (id: number) =>
      request(`/admin/users/${id}`, { method: 'DELETE' }),
  },
};
