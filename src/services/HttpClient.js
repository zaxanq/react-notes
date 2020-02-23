class HttpClient {
    get(url) {
        return fetch(url)
            .then( data => data.json() );
    }
}

export default HttpClient;