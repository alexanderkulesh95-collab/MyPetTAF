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
  
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api-staging.example.com',
    username: 'staging-user@test.com',
    password: 'StagingPassword123!',
    database: {
      host: 'staging-db.example.com',
      port: 5432,
      database: 'testdb_staging',
      user: 'staging_user',
      password: 'staging_password'
    },
    timeout: 45000,
    retries: 2
  },
  
  prod: {
    baseURL: 'https://www.example.com',
    apiURL: 'https://api.example.com',
    username: 'prod-user@test.com',
    password: 'ProdPassword123!',
    database: {
      host: 'prod-db.example.com',
      port: 5432,
      database: 'testdb_prod',
      user: 'prod_readonly_user',
      password: 'prod_password'
    },
    timeout: 60000,
    retries: 3
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
function getEnvironmentConfig(env = 'dev') {
  const environment = env.toLowerCase();
  
  if (!environments[environment]) {
    console.warn(`Environment '${environment}' not found. Using 'dev' as default.`);
    return environments.dev;
  }
  
  return environments[environment];
}

/**
 * Get current environment name
 * @returns {string} Current environment
 */
function getCurrentEnvironment() {
  return process.env.ENV || 'dev';
}

module.exports = {
  environments,
  getEnvironmentConfig,
  getCurrentEnvironment
};
