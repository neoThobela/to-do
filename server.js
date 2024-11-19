const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS and JS)
app.use(express.static(path.join(__dirname, 'public')));

// Enable middleware
app.use(cors());
app.use(bodyParser.json());

// Path to todos file
const todoFilePath = path.join(__dirname, 'todos.json');

// Helper functions
function readTodos() {
  if (fs.existsSync(todoFilePath)) {
    return JSON.parse(fs.readFileSync(todoFilePath));
  }
  return [];
}

function writeTodos(todos) {
  fs.writeFileSync(todoFilePath, JSON.stringify(todos, null, 2));
}

// Render main page
app.get('/', (req, res) => {
  res.render('index');
});

// APIs for Todos
app.get('/todos', (req, res) => res.json(readTodos()));

app.post('/todos', (req, res) => {
  const { task, dueDate } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  const todos = readTodos();
  const newTodo = { id: uuidv4(), task, completed: false, dueDate: dueDate || null };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const todos = readTodos();
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (task) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  writeTodos(todos);
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos().filter(t => t.id !== id);
  writeTodos(todos);
  res.status(204).send();
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
