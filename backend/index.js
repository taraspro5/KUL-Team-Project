import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
  }));

let db;

async function initDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      image TEXT NOT NULL,
      price INTEGER NOT NULL
    );
  `);

  const row = await db.get('SELECT COUNT(*) AS count FROM products');
  if (row.count < 10) {
    const insertStmt = await db.prepare('INSERT INTO products (name, type, image, price) VALUES (?, ?, ?, ?)');
    
    const products = [
      ['Orange', 'Dark chocolate', 'orange', 45],
      ['Apple & Cranberry', 'Milk chocolate', 'apple-cranberry', 50],
      ['Lime & Sea Salt', 'Dark chocolate', 'lime-sea-salt', 66],
      ['Pineapple', 'Dark chocolate', 'pineapple', 54],
      ['Classic Milk', 'Milk chocolate', 'classic-milk', 45],
      ['Honey', 'Milk chocolate', 'honey', 50],
      ['Roasted Fruits', 'Dark chocolate', 'roasted-fruits', 66],
      ['Classic White', 'White chocolate', 'classic-white', 54],
      ['Single Affair', 'Dark chocolate', 'single-affair', 44],
      ['Caramel Notes', 'Milk chocolate', 'caramel-notes', 51]
    ];
    
    for (let product of products) {
      await insertStmt.run(...product);
    }
    await insertStmt.finalize();
    console.log('Added products to data.');
  } else {
    console.log(`Database has ${row.count} records.`);
  }
}

app.get('/api/items', async (req, res) => {
  try {
    const items = await db.all('SELECT * FROM products');
    res.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error fatching data' });
  }
});

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server run at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error start database:', err);
  });
