export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "");

export const buildUrl = (path) => {
  if (!path) return API_BASE_URL || "";
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiFetch = (path, options = {}) => {
  const merged = { credentials: "include", ...options };
  return fetch(buildUrl(path), merged);
};
