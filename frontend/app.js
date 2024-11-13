
const apiUrl = 'http://localhost:3001/todos';
const addButton = document.getElementById('add-btn');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const timeCard = document.getElementById('time-card');
const dayCard = document.getElementById('day-card');
const completionChartCanvas = document.getElementById('completion-chart').getContext('2d');

// const addButton = document.getElementById('add-btn');
// const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date'); // Date input element
// const todoList = document.getElementById('todo-list');

// Modified addTodo function to include due date
async function addTodo() {
  if (!input.value.trim()) return;
  
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: input.value.trim(),
      dueDate: dateInput.value, // Save due date
      completed: false
    })
  });
  
  input.value = '';
  dateInput.value = ''; // Clear date input
  loadTodos();
}

// Modified todoHTML function to include due date, checkbox, and icons
function todoHTML({ id, task, completed, dueDate }) {
  const itemBackground = completed ? '#d3f9d8' : '#2e2d2c';
  const textColor = completed ? '#2e8b57' : '#b4b4b4';

  return `
    <li class="todo-item" style="background-color: ${itemBackground}; color: ${textColor};">
      <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''} onclick="toggleComplete(${id}, ${!completed})">
      <span>${task}</span>
      ${dueDate ? `<div class="todo-date">Due: ${dueDate}</div>` : ''}
      <div class="todo-buttons">
        <button class="todo-icon edit-btn" onclick="showEdit(${id}, '${task}')"></button>
        <button class="todo-icon delete-btn" onclick="deleteTodo(${id})"></button>
      </div>
    </li>
  `;
}

// New function to toggle completion status
async function toggleComplete(id, completed) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTodos();
}

// M submitEdit function to handle date editing if needed
function submitEdit(id) {
  const updatedTask = document.getElementById(`edit-${id}`).value;
  if (updatedTask.trim()) updateOrDelete(id, 'PUT', { task: updatedTask.trim() });
}

// No change to deleteTodo, update time display, or completion chart


// Initialize chart
let completionChart = new Chart(completionChartCanvas, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [0, 1], // Initially, 0% completed
      backgroundColor: ['#7AF17A', '#e4e4e4'],
      
      borderWidth: 0
    }]
  },
  options: {
    cutoutPercentage: 70,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      }
    }
  }
});

addButton.addEventListener('click', addTodo);
window.onload = loadTodos;
setInterval(updateTimeAndDay, 1000); // Update every second

async function loadTodos() {
  const todos = await fetch(apiUrl).then(res => res.json());
  todoList.innerHTML = todos.map(todoHTML).join('');
  updateCompletionChart(todos); // Update chart when todos are loaded
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

async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });
  loadTodos();
}

function updateCompletionChart(todos) {
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  completionChart.data.datasets[0].data = [completedPercentage, 100 - completedPercentage];
  completionChart.update();
}

function updateTimeAndDay() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const day = now.toLocaleString('en-US', { weekday: 'long' });
  timeCard.textContent = `${hours}:${minutes}:${seconds}`;
  dayCard.textContent = day;
}
function updateCompletionChart(todos) {
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Update chart data
  completionChart.data.datasets[0].data = [completedPercentage, 100 - completedPercentage];
  completionChart.update();

  // Update motivational message
  const motivationMessage = document.getElementById('motivation-message');
  if (completedPercentage === 0) {
    motivationMessage.textContent = "Let's get started on those tasks!";
  } else if (completedPercentage < 50) {
    motivationMessage.textContent = "Good start! Keep going!";
  } else if (completedPercentage < 100) {
    motivationMessage.textContent = "Almost there! Just a few more to go!";
  } else {
    motivationMessage.textContent = "Great job! You've completed all your tasks!";
  }
}
