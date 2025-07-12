const API_LOCAL = 'https://api.ems.api-score.com';

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
