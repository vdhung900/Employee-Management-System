import { jwtDecode } from "jwt-decode";
import APIConfig from "../services/APIConfig";
import {Navigate} from "react-router-dom";
import React from "react";

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

/**
 * Utility function for making authenticated API requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} body - Request body (for POST, PUT requests)
 * @param {boolean} includeUserId - Whether to include userId from token in the endpoint (for DELETE requests)
 * @param {Object} customHeaders - Additional headers to include
 * @returns {Promise<any>} - Response data
 */
export const fetchWithAuth = async (
  endpoint,
  method = "GET",
  body = null,
  includeUserId = false,
  customHeaders = {}
) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      let redirectTo = '/403';
      return <Navigate to={redirectTo} replace state={{ unauthorized: true }} />;
    }
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.clear();
      let redirectTo = '/403';
      return <Navigate to={redirectTo} replace state={{ unauthorized: true }} />;
    }

    let url = `${APIConfig.baseUrl}${endpoint}`;

    if (includeUserId) {
      const decode = jwtDecode(token);
      url = `${APIConfig.baseUrl}${endpoint}${endpoint.endsWith("/") ? "" : "/"}${decode.userId}`;
    }

    const clientIP = await getClientIP();

    const options = {
      method,
      headers: {
        ...APIConfig.getAuthHeaders(token),
        "X-Client-IP": clientIP,
        ...customHeaders,
      },
    };

    if (body) {
      if (body instanceof FormData) {
        delete options.headers['Content-Type'];
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Có lỗi xảy ra");
    }

    return data;
  } catch (error) {
    if (error.message === "jwt expired") {
      window.location.href = "/403";
    }
    throw error;
  }
};

/**
 * Utility function for handling API errors consistently
 * @param {Error} error - The error object
 * @param {Function} callback - Optional callback for custom error handling
 * @returns {Object} - Error object with message
 */
export const handleApiError = (error, callback = null) => {
  const errorMessage = error.message || "Có lỗi xảy ra khi kết nối đến máy chủ";

  // Call custom error handler if provided
  if (callback && typeof callback === "function") {
    callback(errorMessage);
  }

  return { error: true, message: errorMessage };
};

/**
 * Utility function for making authenticated file API requests to /files endpoint
 * @param {string} endpoint - API endpoint (appended to /files, e.g. '/abc')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} body - Request body (for POST, PUT requests)
 * @param {boolean} includeUserId - Whether to include userId from token in the endpoint (for DELETE requests)
 * @param {Object} customHeaders - Additional headers to include
 * @returns {Promise<any>} - Response data
 */
export const fetchFileWithAuth = async (
  endpoint = '',
  method = 'GET',
  body = null,
  includeUserId = false,
  customHeaders = {}
) => {
  const fullEndpoint = `/files${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  return fetchWithAuth(fullEndpoint, method, body, includeUserId, customHeaders);
};

