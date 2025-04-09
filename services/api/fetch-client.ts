import { createFetch } from "@better-fetch/fetch";

import { authClient } from "@/services/auth/auth-client";
import { CLOUD_ENDPOINTS } from "@/constants";

class ApiClient {
  createAuthenticatedFetch() {
    const cookies = authClient.getCookie();
    return createFetch({
      baseURL: CLOUD_ENDPOINTS.API_MS,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies || "",
      },
    });
  }

  async get<T = any>(endpoint: string) {
    const $fetch = this.createAuthenticatedFetch();
    return $fetch<T>(endpoint);
  }

  async post<T = any>(endpoint: string, data: any) {
    const $fetch = this.createAuthenticatedFetch();
    return $fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(endpoint: string, data: any) {
    const $fetch = this.createAuthenticatedFetch();
    return $fetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string) {
    const $fetch = this.createAuthenticatedFetch();
    return $fetch<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const fetchClient = new ApiClient();
