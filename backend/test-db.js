import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import config from './src/config/config.json' assert { type: 'json' };

dotenv.config();

const dbConfig = config.development;

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            port: dbConfig.port || 3306
        });
        
        console.log('Successfully connected to MySQL server!');
        const [rows] = await connection.execute('SELECT DATABASE() as db, USER() as user, VERSION() as version');
        console.log('Database Info:', rows[0]);
        
        await connection.end();
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        console.error('Error code:', error.code);
        console.error('SQL State:', error.sqlState);
        console.error('\nTroubleshooting tips:');
        console.log('1. Make sure MySQL server is running');
        console.log('2. Verify your MySQL username and password');
        console.log('3. Check if the database exists');
        console.log('4. Verify the MySQL server is configured to accept connections');
    }
}

testConnection();
