const AuthProxy = require('./task8');

async function testProxy() {
    const proxy = new AuthProxy('https://jsonplaceholder.typicode.com');

    console.log('\nTest 1: API Key Strategy');
    proxy.setAuthStrategy({ type: 'API_KEY', credentials: 'super_secret_api_key' });
    await proxy.request('/posts/1');

    console.log('\nTest 2: Dynamic Strategy Switch (JWT)');
    proxy.setAuthStrategy({ type: 'JWT', credentials: 'mock_jwt_token_123' });
    await proxy.request('/users/1');

    console.log('\nTest 3: Rate Limiting');
    try {
        for (let i = 0; i < 6; i++) {
            console.log(`\nRequest ${i + 1}:`);
            await proxy.request('/todos/1');
        }
    } catch (error) {
        console.error(error.message);
    }
}

testProxy();