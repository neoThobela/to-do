const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

// Enable CORS for the frontend
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file that stores to-dos
const todoFilePath = path.join(__dirname, 'todos.json');