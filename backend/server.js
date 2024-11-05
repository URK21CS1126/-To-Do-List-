const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_postgres_user',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'todo_app',
  password: 'your_postgres_password',  // Replace with your PostgreSQL password
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE is_deleted = false');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to add a new task
app.post('/api/tasks', async (req, res) => {
  const { task_name } = req.body;
  const created_at = new Date();

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE task_name = $1 AND created_at = $2', [task_name, created_at]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'Task with this name and timestamp already exists.' });
    }

    const insertResult = await pool.query(
      'INSERT INTO tasks (task_name, created_at, updated_at) VALUES ($1, $2, $2) RETURNING *',
      [task_name, created_at]
    );
    res.json(insertResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { task_name } = req.body;
  const updated_at = new Date();

  try {
    const result = await pool.query(
      'UPDATE tasks SET task_name = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [task_name, updated_at, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to delete a task (soft delete)
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('UPDATE tasks SET is_deleted = true WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
