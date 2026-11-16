const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function api(path, options = {}) {
  const token = localStorage.getItem('daily-diet-token');
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem('daily-diet-token');
      localStorage.removeItem('daily-diet-user');
      window.dispatchEvent(new Event('daily-diet:unauthorized'));
    }
    throw new Error(data.error ?? 'Não foi possível concluir a solicitação.');
  }
  return data;
}

export const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(date));

export const toLocalInput = (date) => {
  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 16);
};
