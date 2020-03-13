const API_URL = 'http://localhost:3001';

class HttpClient {
    constructor() {
        this.headers = { 'Content-Type': 'application/json' };
    }

    get(url) {
        return fetch(url)
            .then( data => data.json() );
    }

    post(url, body) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: this.headers,
        });
    }

    put(url, body) {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: this.headers,
        });
    }

    delete(url) {
        return fetch(url, {
            method: 'DELETE',
            headers: this.headers,
        });
    }
}

export const Api = {
    Notes: `${API_URL}/notes`,
    Categories: `${API_URL}/categories`,
};

export default HttpClient;
