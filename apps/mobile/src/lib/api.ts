import { getAccessToken } from "./auth-storage";

const API_URL = "http://192.168.0.100:3000";

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { authenticated = false, headers, ...restOptions } = options;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  if (authenticated) {
    const token = await getAccessToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message;

    throw new Error(message || "Something went wrong. Please try again.");
  }

  return data;
}

export { API_URL };
