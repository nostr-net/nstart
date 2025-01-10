// server.js
import { createServer } from 'http';
import { handler } from './build/handler.js'; // Adjust the path based on your build output

const PORT = process.env.PORT || 8001; // Define the port to listen on

const server = createServer(handler); // Create an HTTP server using the handler

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`); // Log when the server starts
});

// Graceful shutdown logic
const shutdown = () => {
    console.log('Received shutdown signal, closing server gracefully...');
    server.close((err) => {
        if (err) {
            console.error('Error during server shutdown:', err);
        }
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });

    // Force shutdown after a timeout
    setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 10000); // 10 seconds timeout
};

process.on('SIGTERM', shutdown); // Handle SIGTERM signal
process.on('SIGINT', shutdown);   // Handle SIGINT signal
