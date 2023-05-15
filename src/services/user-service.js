import apiClient from "./api-client";

class UserService {
  async getAllUsers() {
    const controller = new AbortController();

    const request = await apiClient.get("/users", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

export default new UserService();
