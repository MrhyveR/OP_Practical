class AuthProxy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.authStrategy = null;
        
        this.requestCount = 0;
        this.rateLimit = 5;
        this.rateLimitWindow = 10000;
        this.rateLimitReset = Date.now() + this.rateLimitWindow;
    }

    setAuthStrategy(strategy) {
        this.authStrategy = strategy;
        console.log(`[LOG] Auth strategy set to: ${strategy.type}`);
    }

    _injectAuthHeaders(headers = {}) {
        if (!this.authStrategy) return headers;
        const { type, credentials } = this.authStrategy;
        const newHeaders = { ...headers };

        if (type === 'API_KEY') newHeaders['X-Api-Key'] = credentials;
        else if (type === 'JWT' || type === 'OAuth') newHeaders['Authorization'] = `Bearer ${credentials}`;
        
        return newHeaders;
    }

    _checkRateLimit() {
        const now = Date.now();
        if (now > this.rateLimitReset) {
            this.requestCount = 0;
            this.rateLimitReset = now + this.rateLimitWindow;
        }
        if (this.requestCount >= this.rateLimit) {
            throw new Error(`[Rate limit] Too many requests. Try again after ${new Date(this.rateLimitReset).toLocaleTimeString()}`);
        }
        this.requestCount++;
    }

    async _refreshToken() {
        console.log('[Log] Token expired. Automatically renewing token...');
        const newToken = `refreshed_token_${Date.now()}`;
        this.authStrategy.credentials = newToken;
        return newToken;
    }

    async request(endpoint, options = {}) {
        this._checkRateLimit();

        const url = `${this.baseUrl}${endpoint}`;
        console.log(`[Log] Requesting: ${options.method || 'Get'} ${url}`);

        options.headers = this._injectAuthHeaders(options.headers || {});

        try {
            let response = await fetch(url, options);

            if (response.status === 401 && (this.authStrategy.type === 'JWT' || this.authStrategy.type === 'OAuth')) {
                await this._refreshToken();
                options.headers = this._injectAuthHeaders(options.headers || {});
                console.log(`[Log] Retrying request with new token...`);
                response = await fetch(url, options);
            }

            console.log(`[Log] Response Status: ${response.status} ${response.statusText}`);
            return response;
        } catch (error) {
            console.error(`[Error] Request failed:`, error.message);
            throw error;
        }
    }
}

module.exports = AuthProxy;