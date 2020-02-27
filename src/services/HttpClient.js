const API_URL = 'http://localhost:3001';

class HttpClient {
    get(url) {
        return fetch(url)
            .then( data => data.json() );
    }

    put(url, body, headers = { 'Content-Type': 'application/json' }) {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        })
            .then( data => { console.log(data) });
    }
}

export const Api = {
    Notes: `${API_URL}/notes`,
    Categories: `${API_URL}/categories`,
};

export default HttpClient;
