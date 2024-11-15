﻿To-Do List Application
Overview
This project is a simple To-Do List web application with a modern user interface. It allows users to add, update, delete, and mark tasks as completed. The app features a chart to show the progress of task completion, a real-time clock, and an integrated motivational message system to encourage users to complete their tasks.

Features:
Add, edit, and delete tasks.
Mark tasks as completed or not.
View tasks with due dates.
Display real-time time and day.
Interactive completion chart.
Motivational messages based on task completion.
The project is structured with:

Frontend (HTML, CSS, JavaScript)
Backend (Node.js with Express)
Database (JSON file for storing tasks)
Installation
1. Clone the repository
bash
Copy code
git clone <repo-url>
cd <repo-directory>
2. Setup Backend
Navigate to the backend directory:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Run the backend server:

bash
Copy code
node server.js
The server will run on http://localhost:3001.

3. Setup Frontend
Navigate to the frontend directory:

bash
Copy code
cd frontend
Open the index.html file in a browser.

The frontend will automatically communicate with the backend at http://localhost:3001.

File Structure
bash
Copy code
/project-root
│
├── /backend
│   ├── server.js           # Express server code
│   ├── todos.json          # Data storage (tasks)
│   └── package.json        # Backend dependencies
│
├── /frontend
│   ├── index.html          # HTML markup for the app
│   ├── style.css           # Styling for the app
│   └── app.js              # JavaScript for frontend logic
└── README.md               # Project documentation
Backend API
The backend API is built using Node.js and Express. The data is stored in a simple JSON file (todos.json). The API endpoints are:

GET /todos - Fetch all tasks.
POST /todos - Add a new task.
PUT /todos/:id - Update a task.
DELETE /todos/:id - Delete a task.
Frontend
The frontend is built using:

HTML for structure.
CSS for styling.
JavaScript for dynamic functionality.
The frontend communicates with the backend API to:

Fetch and display tasks.
Allow users to add, update, and delete tasks.
Display the task completion percentage with a Chart.js doughnut chart.
Show real-time clock and day.
Frontend Files:
index.html: The main HTML structure for the to-do list application.
style.css: Styles for the to-do list, clock, and motivational message.
app.js: Handles interactions, including fetching tasks, adding new tasks, and updating the completion chart.
Libraries/Technologies Used:
Chart.js: For the completion chart.
Fetch API: To make HTTP requests to the backend.
Flexbox: For layout management.
Features in Detail
1. Time & Day Display
The current time and day are dynamically updated every second on the page.
2. Task Management
Users can add tasks via an input field and specify a due date.
Tasks are displayed in a list with checkboxes to mark them as completed.
Tasks can be edited and deleted via buttons.
3. Completion Status
A doughnut chart updates to show the percentage of tasks completed.
The chart and motivational message update as tasks are marked as completed.
4. Motivational Messages
Based on the completion percentage, the app will show motivational messages:
0%: "Let's get started on those tasks!"
50%: "Good start! Keep going!"
100%: "Great job! You've completed all your tasks!"
How to Use
Adding a Task
Type the task in the "What do you need to do?" input field.
Optionally, select a due date using the date picker.
Click the "Add" button to add the task to the list.
Updating a Task
Click the ✏️ icon next to a task.
Edit the task and press Enter or click outside the input field to save.
Deleting a Task
Click the 🗑️ icon next to a task to remove it from the list.
Marking a Task as Complete
Click the checkbox next to a task to mark it as completed.
The background color of completed tasks will change, and the chart will update.
Development
Requirements
Node.js (backend)
npm (for dependencies)
To run the development environment:

Install backend dependencies using npm install in the backend folder.
Start the server with node server.js.
Open index.html from the frontend folder in a browser.


this is my demo

https://github.com/user-attachments/assets/97f16f18-2da2-4669-a08a-715fa43439a4


