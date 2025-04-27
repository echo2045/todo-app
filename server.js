const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',          // your PostgreSQL username
  host: 'localhost',
  database: 'todo_db',        // your database name
  password: '1234', // your PostgreSQL password
  port: 5432,
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Get active (not done) tasks
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos WHERE done = false ORDER BY deadline ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get completed (done) tasks
app.get('/todos/completed', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos WHERE done = true ORDER BY completed_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching completed todos:', err);
    res.status(500).json({ error: 'Failed to fetch completed todos' });
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { task, deadline } = req.body;
  try {
    await pool.query(
      'INSERT INTO todos (task, deadline) VALUES ($1, $2)',
      [task, deadline]
    );
    res.json({ message: 'Todo added successfully' });
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Mark a task as done and record completed time
app.put('/todos/:id/done', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE todos SET done = true, completed_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    res.json({ message: 'Todo marked as done' });
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  });  

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
