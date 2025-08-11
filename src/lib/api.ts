const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

function prepareOptions(options: RequestInit = {}): RequestInit {
  const finalOptions: RequestInit = { ...options };

  finalOptions.method = finalOptions.method || "GET";

  if (finalOptions.method !== "GET") {
    const hasContentType = finalOptions.headers
      ? Object.keys(finalOptions.headers).some(
          (h) => h.toLowerCase() === "content-type"
        )
      : false;

    if (!hasContentType) {
      finalOptions.headers = {
        ...(finalOptions.headers || {}),
        "Content-Type": "application/json",
      };
    }

    // Stringify body if it's a plain object
    if (
      finalOptions.body &&
      typeof finalOptions.body === "object" &&
      !(finalOptions.body instanceof FormData)
    ) {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }
  }

  return finalOptions;
}

async function parseResponse(res: Response) {
  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("Content-Type");
  if (!contentType) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  if (contentType.includes("text/")) {
    return res.text();
  }

  try {
    return await res.json();
  } catch {
    try {
      return await res.text();
    } catch {
      return res;
    }
  }
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const finalOptions = prepareOptions(options);

  const res = await fetch(`${API_URL}${endpoint}`, finalOptions);

  if (!res.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      try {
        errorMessage = await res.text();
      } catch {
        // ignore
      }
    }
    throw new Error(errorMessage);
  }

  return parseResponse(res);
}

export async function authRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  return apiRequest(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
