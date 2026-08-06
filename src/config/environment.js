export const ENVIRONMENTS = {
  development: {
    id: 'development',
    label: '🛠️ Local Dev (10.0.0.23:9000)',
    apiUrl: 'http://10.0.0.23:9000',
    wsUrl: 'ws://10.0.0.23:9000'
  },
  staging: {
    id: 'staging',
    label: '☁️ Railway Staging',
    apiUrl: 'https://digitpop-server-staging.up.railway.app',
    wsUrl: 'wss://digitpop-server-staging.up.railway.app'
  },
  production: {
    id: 'production',
    label: '🚀 Production',
    apiUrl: 'https://api.opportunity-system.com',
    wsUrl: 'wss://api.opportunity-system.com'
  }
};
