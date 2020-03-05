const API_URL = 'http://localhost:3001';

class HttpClient {
    get(url) {
        return fetch(url)
            .then( data => data.json() );
    }

    post(url, body, headers = { 'Content-Type': 'application/json' }) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        });
    }
}

export const Api = {
    Notes: `${API_URL}/notes`,
    Categories: `${API_URL}/categories`,
};

export default HttpClient;
