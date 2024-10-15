const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.error('Connexion à MongoDB échouée !', error);
})

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books' , bookRoutes);

module.exports = app;