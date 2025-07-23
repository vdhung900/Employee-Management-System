import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";
import APIConfig from "./APIConfig";

let API_GET_IP = 'https://api.ipify.org?format=json';

let cachedClientIP = null;

const getClientIP = async () => {
  if (cachedClientIP) return cachedClientIP;

  try {
    const res = await fetch(API_GET_IP);
    const data = await res.json();
    cachedClientIP = data.ip;
    return cachedClientIP;
  } catch (error) {
    console.warn("Không lấy được IP client:", error);
    return "unknown";
  }
};

const AuthService = {
  async login(body) {
    const loginUrl = APIConfig.baseUrl + "/auth/login";
    const clientIP = await getClientIP();
    try {
      return fetch(loginUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "X-Client-IP": clientIP,
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
