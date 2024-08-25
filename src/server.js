const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});