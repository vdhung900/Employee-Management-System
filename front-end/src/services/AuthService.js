import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";

const AuthService = {
  async login(body) {
    const loginUrl = "http://127.0.0.1:9123/auth/login";
    try {
      fetch(loginUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default AuthService;
