const apiUrl = 'http://localhost:3001/todos';
const addButton = document.getElementById('add-btn');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', addTodo);
window.onload = loadTodos;

async function loadTodos() {
  const todos = await fetch(apiUrl).then(res => res.json());
  todoList.innerHTML = todos.map(todoHTML).join('');
}

async function addTodo() {
  if (!input.value.trim()) return;
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: input.value.trim() })
  });
  input.value = '';
  loadTodos();
}

async function updateOrDelete(id, action, newTask) {
  await fetch(`${apiUrl}/${id}`, {
    method: action,
    headers: { 'Content-Type': 'application/json' },
    body: action === 'PUT' ? JSON.stringify(newTask) : null
  });
  loadTodos();
}

function todoHTML({ id, task, completed }) {
  const itemBackground = completed ? '#d3f9d8' : '#ffe6e6';  // Soft green for completed, pink for incomplete
  const textColor = completed ? '#2e8b57' : '#4b4b4b'; // Dark green for completed, gray for incomplete

  return `
    <li class="todo-item" style="background-color: ${itemBackground}; color: ${textColor};">
      <span>${task}</span>
      <button onclick="updateOrDelete(${id}, 'PUT', { completed: ${!completed} })">
        ${completed ? 'Undo' : 'Complete'}
      </button>
      <button onclick="showEdit(${id}, '${task}')">Edit</button>
      <button onclick="deleteTodo(${id})">Delete</button> <!-- Delete button calls deleteTodo -->
    </li>
  `;
}

function showEdit(id, currentTask) {
  todoList.innerHTML = todoList.innerHTML.replace(
    `<span>${currentTask}</span>`,
    `<input id="edit-${id}" class="edit-input" value="${currentTask}" onblur="submitEdit(${id})" autofocus>`
  );
}

function submitEdit(id) {
  const updatedTask = document.getElementById(`edit-${id}`).value;
  if (updatedTask.trim()) updateOrDelete(id, 'PUT', { task: updatedTask.trim() });
}

// Function to delete a specific todo by ID
async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });
  loadTodos(); // Reload the todos list after deletion
}
