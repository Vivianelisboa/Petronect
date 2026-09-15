/**
 * services/apiClient.js
 * Wrapper fino sobre `fetch`. Cuida da URL base, do cabeçalho JSON e de
 * transformar respostas HTTP ruins em exceções — para que os hooks possam
 * tratar erro de um jeito só.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 400 && res.status !== 404) {
    throw new Error(`Erro na API: ${res.status}`);
  }
  return res.json();
}
