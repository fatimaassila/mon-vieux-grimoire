
const Book = require('../models/book');
const fs = require('fs');
const path = require('path')

const computeAverage = (grades) => {
    if(grades === undefined || !grades) return 0;
    return grades.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / grades.length;
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne ({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne ({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'livre supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
 };

 exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error}));
};

exports.getAllBooks =(req, res, next) => {
    Book.find()
   .then(books => res.status(200).json(books))
   .catch(error => res.status(400).json({ error })); 
};

exports.getBestRating =( req , res , next) =>{
    Book.find()
   .sort({averageRating: -1 })
   .limit(3)
   .then(books => res.status(200).json(books))
   .catch(error => res.status(400).json({ error }));
};

exports.ratingBook = (req , res , next ) =>{ 
    const bookId = req.params.id;
    const userId = req.body.userId;
    const rating = req.body.rating;
    //vérifier que la note est comprise entre 0 et 5
    if (0 <= rating <= 5) {
        const ratingObject = { userId: userId, grade: rating };
        delete ratingObject._id;
        // Récupération du livre 
        Book.findOne({_id: bookId})
            .then((book) => {
                console.log(book);
                const userIdArray = book.ratings.map(rating => rating.userId);
                // vérifier que l'utilisateur authentifié n'a jamais donné de note au livre
                if (userIdArray.includes(userId)) {
                    res.status(400).json({ message : 'Vous ne pouvez pas modifier une note déjà existante' });
                } else {
                    const newRatings = book.ratings;
                    // Ajout de la note
                    newRatings.push(ratingObject);
                    console.log("newRating " +newRatings);
                    const grades = newRatings.map(r => r.grade);
                    console.log("grades " +grades);
                    const averageGrades = computeAverage(grades);
                    console.log("averageGrades " +averageGrades);
                    book.averageRating = averageGrades;
                    //Mise à jour du livre avec la nouvelle note ainsi que la nouvelle moyenne des notes
                    Book.updateOne(
                        { _id: bookId }, 
                        { ratings: newRatings, averageRating: averageGrades, _id: bookId })
                        .then(() => { res.status(201).json()})
                        .catch(error => { res.status(400).json( { error })});
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
    }
};