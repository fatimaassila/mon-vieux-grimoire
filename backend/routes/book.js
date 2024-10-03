const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, resizeImag } = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/bestrating', bookCtrl.getBestRating);
router.post('/', auth, upload, resizeImag, bookCtrl.createBook);   
router.put('/:id', auth, upload, resizeImag, bookCtrl.modifyBook );
router.delete('/:id', auth, bookCtrl.deleteBook); 
router.get('/:id', bookCtrl.getOneBook );
router.get('/', bookCtrl.getAllBooks );
router.post ('/:id/rating', auth, bookCtrl.ratingBook);

module.exports = router;