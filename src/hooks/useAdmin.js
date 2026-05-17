const TOKEN_KEY = 'ml_admin_token';

export const getToken    = () => localStorage.getItem(TOKEN_KEY);
export const setToken    = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken  = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn  = () => !!getToken();

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  return res;
}
