import { Certificate, PublicPortfolio, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type UpdateUserPayload = {
  name: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  profile_image: string;
  social_links: {
    linkedin: string;
    github: string;
  };
  portfolio_password: string;
};

type PublicProfileError = {
  requiresPassword: boolean;
  message: string;
};

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : {};

  if (!response.ok) {
    const error = new Error((payload as { message?: string }).message || "Request failed") as Error &
      PublicProfileError;
    error.requiresPassword = Boolean(
      (payload as { requires_password?: boolean }).requires_password,
    );
    throw error;
  }

  return payload as T;
}

export async function registerUser(payload: RegisterPayload) {
  return request<{ access_token: string; user: User }>("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return request<{ access_token: string; user: User }>("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(token: string) {
  return request<{ user: User }>("/user/me", {}, token);
}

export async function updateCurrentUser(token: string, payload: UpdateUserPayload) {
  return request<{ user: User }>(
    "/user/me",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getCertificates(token: string) {
  return request<{ certificates: Certificate[] }>("/certificate/list", {}, token);
}

export async function addCertificate(token: string, formData: FormData) {
  return request<{ certificate: Certificate }>(
    "/certificate/add",
    {
      method: "POST",
      body: formData,
    },
    token,
  );
}

export async function deleteCertificate(token: string, certificateId: number) {
  return request<{ message: string }>(
    `/certificate/${certificateId}`,
    {
      method: "DELETE",
    },
    token,
  );
}

export async function getPublicPortfolio(username: string) {
  return request<PublicPortfolio>(`/profile/${username}`);
}

export async function unlockPublicPortfolio(username: string, password: string) {
  return request<PublicPortfolio>(`/profile/${username}/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
}
