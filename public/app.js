const apiUrl = 'http://localhost:3001/todos';
const addButton = document.getElementById('add-btn');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const timeCard = document.getElementById('time-card');
const dayCard = document.getElementById('day-card');
const completionChartCanvas = document.getElementById('completion-chart').getContext('2d');
const dateInput = document.getElementById('todo-date');

let completionChart = null; // Store the chart instance globally

window.onload = function () {
  dateInput.value = new Date().toISOString().split('T')[0];
  loadTodos();
  setInterval(updateTimeAndDay, 1000);
};

async function addTodo() {
  const taskValue = input.value.trim();
  const dueDateValue = dateInput.value;

  if (!taskValue || !dueDateValue) {
    alert('Both the task and the due date are required.');
    return;
  }

  try {
    // Send POST request to create a new todo
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskValue, dueDate: dueDateValue, completed: false })
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    input.value = '';
    dateInput.value = new Date().toISOString().split('T')[0]; // Reset date to current day
    await loadTodos(); // Reload todos after adding
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

function todoHTML({ id, task, completed, dueDate }) {
  const sanitizedId = encodeURIComponent(id); // Escape the ID for safety
  const itemBackground = completed ? '#d3f9d8' : '#2e2d2c';
  const textColor = completed ? '#2e8b57' : '#b4b4b4';

  return `
    <li class="todo-item" id="todo-${sanitizedId}" style="background-color: ${itemBackground}; color: ${textColor};">
      <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''} 
        onclick="toggleComplete('${sanitizedId}', ${!completed})">
      <span>${task}</span>
      ${dueDate ? `<div class="todo-date">Due: ${new Date(dueDate).toLocaleDateString()}</div>` : ''}
      
        <div onclick="deleteTodo('${sanitizedId}')" class="icon delete-icon">
          🗑️ <span class="tooltip">Delete</span>
        </div>
      </div>
    </li>
  `;
}


// async function toggleComplete(id, completed) {
//   try {
//     // Send PUT request to toggle the completion status of the todo
//     const response = await fetch(`${apiUrl}/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ completed })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update completion status');
//     }

//     await loadTodos(); // Reload todos after update
//   } catch (error) {
//     console.error('Error toggling completion:', error);
//   }
// }
// function showEdit(id, task) {
//   console.log('ID:', id); // Debugging
//   const todoItem = document.getElementById(`todo-${id}`);

//   if (!todoItem) {
//     console.error(`Element with ID todo-${id} not found.`);
//     return; // Exit the function to prevent further errors
//   }

//   console.log('Todo item found:', todoItem); // Check if the element is found

//   // Get the current background color
//   const backgroundColor = window.getComputedStyle(todoItem).backgroundColor;

//   // Safely encode the task to handle special characters
//   const encodedTask = encodeURIComponent(task);

//   // Update the todo item
//   todoItem.outerHTML = `
//     <li class="todo-item" id="todo-${id}" style="background-color: ${backgroundColor}">
//       <input type="text" value="${task}" id="edit-${id}" class="todo-edit">
//       <button onclick="saveEdit('${id}')">Save</button>
//       <button onclick="cancelEdit('${id}', '${encodedTask}')">Cancel</button>
//     </li>
//   `;
// }

// function saveEdit(id) {
//   const inputField = document.getElementById(`edit-${id}`);
  
//   if (!inputField) {
//     console.error(`Edit input field with ID edit-${id} not found.`);
//     return;
//   }

//   const newTask = inputField.value;

//   // Get the current todo item and its background color
//   const todoItem = document.getElementById(`todo-${id}`);
//   if (!todoItem) {
//     console.error(`Element with ID todo-${id} not found.`);
//     return;
//   }
//   const backgroundColor = window.getComputedStyle(todoItem).backgroundColor;

//   // Replace the input field with the updated task
//   todoItem.outerHTML = `
//     <li class="todo-item" id="todo-${id}" style="background-color: ${backgroundColor}">
//       <input type="checkbox" onclick="toggleComplete('${id}', false)">
//       <span>${newTask}</span>
//       <div>
//         <div onclick="showEdit('${id}', '${newTask.replace(/'/g, "\\'")}')" class="icon edit-icon">✏️</div>
//         <div onclick="deleteTodo('${id}')" class="icon delete-icon">🗑️</div>
//       </div>
//     </li>
//   `;
// }

function cancelEdit(id, originalTask) {
  const todoItem = document.getElementById(`todo-${id}`);
  
  if (!todoItem) {
    console.error(`Element with ID todo-${id} not found.`);
    return;
  }

  // Decode the original task safely
  const decodedTask = decodeURIComponent(originalTask);

  // Get the current background color
  const backgroundColor = window.getComputedStyle(todoItem).backgroundColor;

  // Restore the original item
  todoItem.outerHTML = `
    <li class="todo-item" id="todo-${id}" style="background-color: ${backgroundColor}">
      <input type="checkbox" onclick="toggleComplete('${id}', false)">
      <span>${decodedTask}</span>
      <div>
        <div onclick="showEdit('${id}', '${decodedTask.replace(/'/g, "\\'")}')" class="icon edit-icon">✏️</div>
        <div onclick="deleteTodo('${id}')" class="icon delete-icon">🗑️</div>
      </div>
    </li>
  `;
}



async function submitEdit(id) {
  const editInput = document.getElementById(`edit-${id}`);
  if (!editInput) return;

  const updatedTask = editInput.value.trim();

  if (updatedTask) {
    try {
      // Send PUT request to update the task text
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: updatedTask })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await loadTodos(); // Reload todos after update
    } catch (error) {
      console.error('Error updating task:', error);
    }
  } else {
    alert('Task cannot be empty.');
  }
}

async function deleteTodo(id) {
  try {
    // Send DELETE request to remove the todo
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    await loadTodos(); // Reload todos to reflect the deletion
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

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

function updateTimeAndDay() {
  const now = new Date();
  timeCard.textContent = now.toLocaleTimeString();
  dayCard.textContent = now.toLocaleDateString();
}

function updateCompletionChart(todos) {
  const totalTodos = todos.length;

  const data = totalTodos === 0
    ? {
        labels: ['No Tasks'],
        datasets: [{
          data: [1],
          backgroundColor: ['#f7f3f3'],
          borderColor: ['#f7f3f3'],
          borderWidth: 1
        }]
      }
    : {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [todos.filter(todo => todo.completed).length, totalTodos - todos.filter(todo => todo.completed).length],
          backgroundColor: ['#4caf50', '#ffb300'],
          borderColor: ['#4caf50', '#ffb300'],
          borderWidth: 1
        }]
      };

  if (completionChart) {
    completionChart.destroy(); // Destroy the existing chart instance
  }

  completionChart = new Chart(completionChartCanvas, {
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
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw} tasks`;
            }
          }
        }
      }
    }
  });
}

addButton.addEventListener('click', addTodo);
async function toggleComplete(id, completed) {
  console.log('Toggling completion for ID:', id, 'Completed:', completed);
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    if (!response.ok) {
      throw new Error('Failed to update completion status');
    }

    await loadTodos(); // Reload todos after update
  } catch (error) {
    console.error('Error toggling completion:', error);
  }
}
