const API_LOCAL = 'http://127.0.0.1:9123';
const API_LOCAL_PROD = 'https://ems-api.api-score.com';

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

// khi code thi doi thanh local
const APIConfig = {
    baseUrl: API_LOCAL,
    headers,
    getAuthHeaders,
};

export default APIConfig;
