import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
    console.log(process.env.RAILWAYDB_HOST)
    try {
        const pool = mysql.createPool({
            host: process.env.RAILWAYDB_HOST,
            user: process.env.RAILWAYDB_USER,
            password: process.env.RAILWAYDB_PASSWORD,
            database: process.env.RAILWAYDB_NAME,
            port: process.env.RAILWAYDB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log("Database connection pool created successfully");
        return pool;
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;