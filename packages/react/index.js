// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const path = require('path');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// App Setup
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port); 
