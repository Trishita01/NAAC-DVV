import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  development: {
    username: process.env.RAILWAYDB_USER || 'root',
    password: process.env.RAILWAYDB_PASSWORD || '',
    database: process.env.RAILWAYDB_NAME || 'naac_dvv',
    host: process.env.RAILWAYDB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || '',
    database: process.env.TEST_DB_NAME || 'naac_dvv_test',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: 'mysql',
  },
};

export default config;
