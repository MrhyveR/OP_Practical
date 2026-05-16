class AuthProxy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.authStrategy = null;
    }

    setAuthStrategy(strategy) {
        this.authStrategy = strategy;
        console.log(`[Log] Auth strategy set to: ${strategy.type}`);
    }

    _injectAuthHeaders(headers = {}) {
        if (!this.authStrategy) return headers;

        const { type, credentials } = this.authStrategy;
        const newHeaders = { ...headers };

        if (type === 'API_KEY') {
            newHeaders['X-Api-Key'] = credentials;
        } else if (type === 'JWT' || type === 'OAuth') {
            newHeaders['Authorization'] = `Bearer ${credentials}`;
        }
        
        return newHeaders;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        console.log(`[Log] Requesting: ${options.method || 'Get'} ${url}`);

        options.headers = this._injectAuthHeaders(options.headers || {});

        try {
            const response = await fetch(url, options);
            console.log(`[Log] Response Status: ${response.status} ${response.statusText}`);
            return response;
        } catch (error) {
            console.error(`[Error] Request failed:`, error.message);
            throw error;
        }
    }
}

module.exports = AuthProxy;