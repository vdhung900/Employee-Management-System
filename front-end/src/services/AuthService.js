import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";
import APIConfig from "./APIConfig";

const AuthService = {
  async login(body) {
    const loginUrl = APIConfig.baseUrl + "/auth/login";
    try {
      return fetch(loginUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default AuthService;
