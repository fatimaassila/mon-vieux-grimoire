const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'livre ajouter !'
    });
});

app.get('/api/books', (req, res, next) => {
    const stuff = [
      {
        _id: '1',
        title: 'Mon premier livre',
        author: 'Les infos de mon premier livre',
        year:1999,
        genre:'architecture',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        rating: 4,
        userId: 'qsomihvqios',
      },
      {
        _id: '2',
        title: 'Mon deuxième livre',
        author: 'Les infos de mon premier livre',
        year:2009,
        genre:'jardinage',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        rating: 3,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
});


module.exports = app;