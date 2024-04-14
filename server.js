const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());

  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'QuabTechDemo',
    password: '100493',
    port: 5432, // Default PostgreSQL port
  });
  
  // Example query to create a table
  pool.query(`
    CREATE TABLE IF NOT EXISTS ticker_data (
      id SERIAL PRIMARY KEY,
      name TEXT,
      last FLOAT,
      buy FLOAT,
      sell FLOAT,
      volume FLOAT,
      base_unit TEXT
    )
  `, (err, res) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created successfully');
    }
  });


  
  // Function to insert data into the database
  const insertData = async (data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of data) {
        const queryText = 'INSERT INTO ticker_data(name, last, buy, sell, volume, base_unit) VALUES($1, $2, $3, $4, $5, $6)';
        const values = [item.name, item.last, item.buy, item.sell, item.volume, item.base_unit];
        await client.query(queryText, values);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  };
  
  // Fetch data from the API and store in the database
 // Fetch data from the API, sort by sell price, and store the top 10 highest selling
const fetchDataAndStore = async () => {
    try {
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
      const data = response.data;
      
      // Convert object to array and sort by sell price in descending order
      let sortedBySellPrice = Object.values(data).sort((a, b) => b.sell - a.sell);
      
      // Take the top 10 with the highest sell price
      const top10Data = sortedBySellPrice.slice(0, 10).map(ticker => ({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      }));
      
      // Insert the sorted data into the database
      await insertData(top10Data);
      console.log('Top 10 data by highest sell prices inserted successfully', top10Data);
    } catch (error) {
      console.error('Error fetching or inserting data: ', error);
    }
  };
  
  fetchDataAndStore();
  
  

app.get('/api/tickers', async (req, res) => {
    try {
      const result = await pool.query('SELECT name, last, buy, sell, volume, base_unit FROM ticker_data ORDER BY sell DESC LIMIT 10');
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving data: ', err);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
