import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config({ path: '.env.development' });

const PORT = process.env.PORT;

app.get('/api', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('Express API running in port ' + PORT);
});
