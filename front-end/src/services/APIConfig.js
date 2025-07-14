const API_LOCAL = 'http://127.0.0.1:9123';

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const APIConfig = {
    baseUrl: API_LOCAL,
    headers,
    getAuthHeaders,
};

export default APIConfig;
