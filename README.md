#Todo List App (Node.js + PostgreSQL)

A full-stack Todo List web application built with Node.js, Express, PostgreSQL, and vanilla HTML/CSS/JavaScript.
This app allows users to manage tasks with deadlines, mark them as done, snooze tasks to a later date, and visually see overdue or late-completed tasks.

##Features
✅ Add new tasks with a task name and deadline

✅ Automatically highlights tasks that are overdue (Late)

✅ Mark tasks as completed

✅ Displays "Done Late" label for tasks completed after their deadlines

✅ Snooze tasks by updating their due date with a calendar input popup

✅ Scrollable containers for Active and Completed tasks

✅ Delete tasks from either Active or Completed list

✅ Clean and responsive UI

##Technologies Used
Backend: Node.js, Express.js

Database: PostgreSQL

Frontend: HTML, CSS, JavaScript

Others: Git, GitHub

##Project Structure

todo-app/
  ├── public/
  │   ├── index.html
  │   ├── style.css
  │   └── script.js
  ├── server.js
  └── package.json
  
##Setup Instructions

###Clone the repository

git clone https://github.com/echo2045/todo-app.git
cd todo-app

###Install Node.js dependencies
npm install

###Setup PostgreSQL database

Create a PostgreSQL database called todo_db. Then create a todos table:

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline TIMESTAMP NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);

###Configure database connection

Edit your server.js file:

const pool = new Pool({
  user: 'YOUR_POSTGRES_USERNAME',
  host: 'localhost',
  database: 'todo_db',
  password: 'YOUR_POSTGRES_PASSWORD',
  port: 5432,
});

###Start the server

nodemon server.js
(Or if you don't have nodemon installed globally, you can also run:)


node server.js

###Access the app

Open your browser and visit:
http://localhost:3000
