const API_BASE_URL = "http://localhost:3001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || payload.message || `Request failed: ${response.status}`);
  }

  return payload;
}

export function loginRequest(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerRequest(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(accessToken) {
  return request("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function logoutRequest(accessToken) {
  return request("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
