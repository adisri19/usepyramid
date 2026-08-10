const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Check URL query param if returning from OAuth redirect
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    localStorage.setItem("pyramid_token", urlToken);
    // Clean token query parameter from URL cleanly without page reload
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    return urlToken;
  }

  return localStorage.getItem("pyramid_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem("pyramid_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pyramid_token");
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    credentials: "include", // Forward cookies
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const errText = await response.text();
    throw new Error(errText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
}
