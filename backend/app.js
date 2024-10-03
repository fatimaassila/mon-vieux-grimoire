const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://fatima:123@cluster0.ib5fx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

// app.use((req, res, next) => {
//   const now = new Date().toLocaleString();
//   console.log(`[${now}] ${req.method} ${req.url}`);

//   if (Object.keys(req.query).length > 0) {
//     console.log('Query Params:', req.query);
//   }


//   if (Object.keys(req.params).length > 0) {
//     console.log('Route Params:', req.params);
//   }

//   if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
//     console.log('Body:', req.body);
//   }

//   next(); 
// });

app.use('/api/auth', userRoutes);
app.use('/api/books' , bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;