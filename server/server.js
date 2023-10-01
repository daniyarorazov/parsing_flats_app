const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'parse_flats',
  password: '123123',
  port: 5432,
});
app.use(cors());
app.get('/api/flats', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM flats');

    res.json(rows);
  } catch (error) {
    console.error('Error querying the database', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3001, () => {
  console.log('API server is running on port 3001');
});
