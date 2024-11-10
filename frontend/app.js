// frontend/app.js

const addButton = document.getElementById('add-btn');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Backend API URL
const apiUrl = 'http://localhost:3001/todos';

// Fetch and display to-dos when the page loads
async function loadTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();

  todoList.innerHTML = ''; // Clear current list
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.task;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Add a new to-do
async function addTodo() {
  const task = input.value.trim();
  if (!task) return;

  const newTodo = { task };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo)
  });

  if (response.ok) {
    input.value = ''; // Clear the input field
    loadTodos(); // Reload the to-do list
  }
}

// Delete a to-do
async function deleteTodo(id) {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

  if (response.ok) {
    loadTodos(); // Reload the to-do list after deletion
  }
}

// Event listener for the "Add" button
addButton.addEventListener('click', addTodo);

// Load to-dos when the page is loaded
loadTodos();
