// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create an Express app
const app = express();
const port = 3001; // Backend runs on port 3001

// Enable CORS for the frontend
app.use(cors());

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Path to the JSON file that stores to-dos
const todoFilePath = path.join(__dirname, 'todos.json');

// Helper functions to read/write to the JSON file
function readTodos() {
  if (fs.existsSync(todoFilePath)) {
    const data = fs.readFileSync(todoFilePath);
    return JSON.parse(data);
  }
  return [];
}

function writeTodos(todos) {
  fs.writeFileSync(todoFilePath, JSON.stringify(todos, null, 2));
}

// Root route to handle requests to http://localhost:3001
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API!');  // You can modify this message
});

// Get all to-dos
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Create a new to-do
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const todos = readTodos();
  const newTodo = {
    id: todos.length + 1,
    task,
    completed: false
  };

  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// Update a to-do
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const todos = readTodos();
  const todo = todos.find(t => t.id == id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (task) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  writeTodos(todos);
  res.json(todo);
});

// Delete a to-do
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  todos = todos.filter(t => t.id != id);
  writeTodos(todos);
  res.status(204).send(); // No content
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
