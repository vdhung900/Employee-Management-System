import { jwtDecode } from "jwt-decode";
import APIConfig from "../services/APIConfig";

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
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Đã hết hạn đăng nhập !!!");
        }

        let url = `${APIConfig.baseUrl}${endpoint}`;

        if (includeUserId) {
            const decode = jwtDecode(token);
            url = `${APIConfig.baseUrl}${endpoint}${endpoint.endsWith('/') ? '' : '/'}${decode.userId}`;
        }

        const options = {
            method,
            headers: {
                ...APIConfig.getAuthHeaders(token),
                ...customHeaders
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Có lỗi xảy ra");
        }

        return data;
    } catch (error) {
        if(error.message === "jwt expired"){
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
    if (callback && typeof callback === 'function') {
        callback(errorMessage);
    }

    return { error: true, message: errorMessage };
};
