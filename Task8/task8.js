class AuthProxy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        console.log(`[Log] Requesting: ${options.method || 'Get'} ${url}`);

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