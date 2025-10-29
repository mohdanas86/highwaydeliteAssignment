import http from 'http';
import { app } from './app.js';
import dotenv from 'dotenv';
import databaseconnection from './db/index.js';

// Load environment variables
dotenv.config();

// database connection
databaseconnection()
    .then(() => {
        http.createServer(app).listen(process.env.PORT || 8080, () => {
            console.log(`Server running on port ${process.env.PORT || 8080}`);
        });
    })
    .catch((error) => console.error('Database connection failed:', error));
