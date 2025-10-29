dotenv.config();

import http from 'http';
import { app } from './app.js';
import dotenv from 'dotenv';
import databaseconnection from './db/index.js';

// database connection
databaseconnection()
    .then(() => {
        http.createServer(app).listen(process.env.PORT || 8080, () => {
            console.log(`Server running on port ${process.env.PORT || 8080}`);
        });
    })
    .catch((error) => console.error('Database connection failed:', error));
