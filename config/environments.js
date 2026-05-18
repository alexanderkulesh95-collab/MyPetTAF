/**
 * Environment configuration for different testing environments
 */

const environments = {
  dev: {
    baseURL: 'https://dev.example.com',
    apiURL: 'https://api-dev.example.com',
    username: 'dev-user@test.com',
    password: 'DevPassword123!',
    database: {
      host: 'dev-db.example.com',
      port: 5432,
      database: 'testdb_dev',
      user: 'dev_user',
      password: 'dev_password'
    },
    timeout: 30000,
    retries: 1
  },
  

  // Demo site for testing
  demo: {
    baseURL: 'https://www.saucedemo.com',
    apiURL: 'https://www.saucedemo.com',
    username: 'standard_user',
    password: 'secret_sauce',
    database: null, // No database for demo
    timeout: 30000,
    retries: 2
  }
};

/**
 * Get configuration for specified environment
 * @param {string} env - Environment name (dev, staging, prod)
 * @returns {object} Environment configuration
 */
function getEnvironmentConfig(env = 'demo') {
  const environment = env.toLowerCase();
  
  if (!environments[environment]) {
    console.warn(`Environment '${environment}' not found. Using 'demo' as default.`);
    return environments.demo;
  }
  
  return environments[environment];
}

/**
 * Get current environment name
 * @returns {string} Current environment
 */
function getCurrentEnvironment() {
  return process.env.ENV || 'demo';
}

module.exports = {
  environments,
  getEnvironmentConfig,
  getCurrentEnvironment
};
