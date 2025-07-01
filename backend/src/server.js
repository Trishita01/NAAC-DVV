import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

// Test the database connection and start the server
const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models (set force: false in production)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
