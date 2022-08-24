import express, { Request, Response } from 'express';
import mysql from 'mysql';

const app = express();

const port = process.env.PORT || 3000;

// Create connection to database
const connectionString = process.env.DATABASE_URL || '';
const connection = mysql.createConnection(connectionString);
connection.connect();

app.get('/api/characters', (req: Request, res: Response) => {
  // Create query String
  const query = 'SELECT * FROM characters';
  connection.query(query, (err, rows) => {
    if (err) throw err;

    const returnValue = {
      data: rows,
      message: rows.length === 0 ? 'No records found' : null,
    };

    return res.send(returnValue);
    // TO connect from terminal pscale connect tog dev --execute 'npm run dev'
  });
});
app.get('/api/characters/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const query = `SELECT * FROM characters WHERE ID = ${id} LIMIT 1`;
  connection.query(query, (err, rows) => {
    if (err) throw err;
    const returnValue = {
      data: rows.length > 0 ? rows[0] : null,
      message: rows.length === 0 ? 'No Record Found' : null,
    };
    return res.send(returnValue);
    // TO connect from terminal pscale connect tog dev --execute 'npm run dev'
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
