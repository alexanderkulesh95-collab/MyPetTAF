const { Client: PostgresClient } = require('pg');
const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const logger = require('./logger');

/**
 * Database Helper for interacting with different databases
 */
class DatabaseHelper {
  constructor() {
    this.pgClient = null;
    this.mysqlConnection = null;
    this.mongoClient = null;
    this.mongoDb = null;
  }

  // ==================== PostgreSQL Methods ====================

  /**
   * Connect to PostgreSQL database
   * @param {object} config - Database configuration
   */
  async connectPostgres(config) {
    try {
      this.pgClient = new PostgresClient({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
      });
      
      await this.pgClient.connect();
      logger.info('Connected to PostgreSQL database');
      return this.pgClient;
    } catch (error) {
      logger.error(`Failed to connect to PostgreSQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute PostgreSQL query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<object>} Query result
   */
  async executePostgresQuery(query, params = []) {
    try {
      if (!this.pgClient) {
        throw new Error('PostgreSQL client not connected');
      }
      
      const result = await this.pgClient.query(query, params);
      logger.info(`Executed PostgreSQL query: ${query}`);
      return result.rows;
    } catch (error) {
      logger.error(`PostgreSQL query failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from PostgreSQL
   */
  async disconnectPostgres() {
    try {
      if (this.pgClient) {
        await this.pgClient.end();
        this.pgClient = null;
        logger.info('Disconnected from PostgreSQL');
      }
    } catch (error) {
      logger.error(`Failed to disconnect from PostgreSQL: ${error.message}`);
      throw error;
    }
  }

  // ==================== MySQL Methods ====================

  /**
   * Connect to MySQL database
   * @param {object} config - Database configuration
   */
  async connectMySQL(config) {
    try {
      this.mysqlConnection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
      });
      
      logger.info('Connected to MySQL database');
      return this.mysqlConnection;
    } catch (error) {
      logger.error(`Failed to connect to MySQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute MySQL query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query result
   */
  async executeMySQLQuery(query, params = []) {
    try {
      if (!this.mysqlConnection) {
        throw new Error('MySQL connection not established');
      }
      
      const [rows] = await this.mysqlConnection.execute(query, params);
      logger.info(`Executed MySQL query: ${query}`);
      return rows;
    } catch (error) {
      logger.error(`MySQL query failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from MySQL
   */
  async disconnectMySQL() {
    try {
      if (this.mysqlConnection) {
        await this.mysqlConnection.end();
        this.mysqlConnection = null;
        logger.info('Disconnected from MySQL');
      }
    } catch (error) {
      logger.error(`Failed to disconnect from MySQL: ${error.message}`);
      throw error;
    }
  }

  // ==================== MongoDB Methods ====================

  /**
   * Connect to MongoDB database
   * @param {string} uri - MongoDB connection URI
   * @param {string} dbName - Database name
   */
  async connectMongoDB(uri, dbName) {
    try {
      this.mongoClient = new MongoClient(uri);
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db(dbName);
      
      logger.info('Connected to MongoDB database');
      return this.mongoDb;
    } catch (error) {
      logger.error(`Failed to connect to MongoDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find documents in MongoDB collection
   * @param {string} collectionName - Collection name
   * @param {object} query - Query filter
   * @returns {Promise<Array>} Documents array
   */
  async findMongoDocs(collectionName, query = {}) {
    try {
      if (!this.mongoDb) {
        throw new Error('MongoDB not connected');
      }
      
      const collection = this.mongoDb.collection(collectionName);
      const documents = await collection.find(query).toArray();
      
      logger.info(`Found ${documents.length} documents in ${collectionName}`);
      return documents;
    } catch (error) {
      logger.error(`MongoDB find operation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Insert document into MongoDB collection
   * @param {string} collectionName - Collection name
   * @param {object} document - Document to insert
   * @returns {Promise<object>} Insert result
   */
  async insertMongoDoc(collectionName, document) {
    try {
      if (!this.mongoDb) {
        throw new Error('MongoDB not connected');
      }
      
      const collection = this.mongoDb.collection(collectionName);
      const result = await collection.insertOne(document);
      
      logger.info(`Inserted document into ${collectionName}`);
      return result;
    } catch (error) {
      logger.error(`MongoDB insert operation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update document in MongoDB collection
   * @param {string} collectionName - Collection name
   * @param {object} filter - Filter criteria
   * @param {object} update - Update operations
   * @returns {Promise<object>} Update result
   */
  async updateMongoDoc(collectionName, filter, update) {
    try {
      if (!this.mongoDb) {
        throw new Error('MongoDB not connected');
      }
      
      const collection = this.mongoDb.collection(collectionName);
      const result = await collection.updateOne(filter, { $set: update });
      
      logger.info(`Updated document in ${collectionName}`);
      return result;
    } catch (error) {
      logger.error(`MongoDB update operation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete document from MongoDB collection
   * @param {string} collectionName - Collection name
   * @param {object} filter - Filter criteria
   * @returns {Promise<object>} Delete result
   */
  async deleteMongoDoc(collectionName, filter) {
    try {
      if (!this.mongoDb) {
        throw new Error('MongoDB not connected');
      }
      
      const collection = this.mongoDb.collection(collectionName);
      const result = await collection.deleteOne(filter);
      
      logger.info(`Deleted document from ${collectionName}`);
      return result;
    } catch (error) {
      logger.error(`MongoDB delete operation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnectMongoDB() {
    try {
      if (this.mongoClient) {
        await this.mongoClient.close();
        this.mongoClient = null;
        this.mongoDb = null;
        logger.info('Disconnected from MongoDB');
      }
    } catch (error) {
      logger.error(`Failed to disconnect from MongoDB: ${error.message}`);
      throw error;
    }
  }

  // ==================== Common Helper Methods ====================

  /**
   * Get user by email (generic example)
   * @param {string} email - User email
   * @param {string} dbType - Database type (postgres, mysql, mongo)
   * @returns {Promise<object>} User object
   */
  async getUserByEmail(email, dbType = 'postgres') {
    try {
      switch (dbType.toLowerCase()) {
        case 'postgres':
          return await this.executePostgresQuery(
            'SELECT * FROM users WHERE email = $1',
            [email]
          );
        
        case 'mysql':
          return await this.executeMySQLQuery(
            'SELECT * FROM users WHERE email = ?',
            [email]
          );
        
        case 'mongo':
          return await this.findMongoDocs('users', { email: email });
        
        default:
          throw new Error(`Unsupported database type: ${dbType}`);
      }
    } catch (error) {
      logger.error(`Failed to get user by email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete test data (cleanup)
   * @param {string} tableName - Table/Collection name
   * @param {string} condition - Where condition
   * @param {string} dbType - Database type
   */
  async deleteTestData(tableName, condition, dbType = 'postgres') {
    try {
      switch (dbType.toLowerCase()) {
        case 'postgres':
          await this.executePostgresQuery(`DELETE FROM ${tableName} WHERE ${condition}`);
          break;
        
        case 'mysql':
          await this.executeMySQLQuery(`DELETE FROM ${tableName} WHERE ${condition}`);
          break;
        
        case 'mongo':
          const filter = JSON.parse(condition); // Assuming condition is JSON string
          await this.deleteMongoDoc(tableName, filter);
          break;
        
        default:
          throw new Error(`Unsupported database type: ${dbType}`);
      }
      
      logger.info(`Deleted test data from ${tableName}`);
    } catch (error) {
      logger.error(`Failed to delete test data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect all database connections
   */
  async disconnectAll() {
    await this.disconnectPostgres();
    await this.disconnectMySQL();
    await this.disconnectMongoDB();
  }
}

module.exports = DatabaseHelper;
