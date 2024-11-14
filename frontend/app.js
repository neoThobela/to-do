const apiUrl = 'http://localhost:3001/todos';
const addButton = document.getElementById('add-btn');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const timeCard = document.getElementById('time-card');
const dayCard = document.getElementById('day-card');
const completionChartCanvas = document.getElementById('completion-chart').getContext('2d');
const dateInput = document.getElementById('todo-date');


window.onload = function() {
  dateInput.value = new Date().toISOString().split('T')[0];
  loadTodos();
  setInterval(updateTimeAndDay, 1000);
};

// Modified addTodo function to include due date
async function addTodo() {
  const taskValue = input.value.trim();
  const dueDateValue = dateInput.value;

  // Check if both task and due date are provided
  if (!taskValue || !dueDateValue) {
    alert("Both the task and the due date are required.");
    return; // Stop the function execution if validation fails
  }

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskValue, dueDate: dueDateValue, completed: false })
    });
    input.value = ''; // Clear the input fields after adding
    dateInput.value = ''; 
    loadTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

// Display Todo HTML with due date
function todoHTML({ id, task, completed, dueDate }) {
  const itemBackground = completed ? '#d3f9d8' : '#2e2d2c';
  const textColor = completed ? '#2e8b57' : '#b4b4b4';

  return `
    <li class="todo-item" style="background-color: ${itemBackground}; color: ${textColor};">
      <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''} onclick="toggleComplete(${id}, ${!completed})">
      <span>${task}</span>
      ${dueDate ? `<div class="todo-date">Due: ${new Date(dueDate).toLocaleDateString()}</div>` : ''}
      <div >
            <div  onclick="showEdit(${id}, '${task}')" class="icon edit-icon">
    ✏️
    <span class="tooltip">Edit</span>
  </div>
       <div onclick="deleteTodo(${id})" class="icon delete-icon">
    🗑️
    <span class="tooltip">Delete</span
      </div>
    </li>
  `;
}

// Toggle Todo completion
async function toggleComplete(id, completed) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTodos();
}

// Edit Todo functionality
function showEdit(id, currentTask) {
  todoList.innerHTML = todoList.innerHTML.replace(
    `<span>${currentTask}</span>`,
    `<input id="edit-${id}" class="edit-input" value="${currentTask}" onblur="submitEdit(${id})" autofocus>`
  );
}

function submitEdit(id) {
  const updatedTask = document.getElementById(`edit-${id}`).value;
  if (updatedTask) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask })
    });
  }
  loadTodos();
}

// Delete Todo
async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTodos();
}

// Load Todos from API
async function loadTodos() {
  try {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    todoList.innerHTML = todos.map(todoHTML).join('');
    updateCompletionChart(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
  }
}

// Update Time and Day on the cards
function updateTimeAndDay() {
  const now = new Date();
  timeCard.textContent = now.toLocaleTimeString();
  dayCard.textContent = now.toLocaleDateString();
}

// Update the Completion Chart with current data
function updateCompletionChart(todos) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [completedTodos, totalTodos - completedTodos],
      backgroundColor: ['#4caf50', '#ffb300'],
      borderColor: ['#4caf50', '#ffb300'],
      borderWidth: 1
    }]
  };

  new Chart(completionChartCanvas, {
    type: 'pie',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw} tasks`;
            }
          }
        }
      }
    }
  });
}

addButton.addEventListener('click', addTodo);