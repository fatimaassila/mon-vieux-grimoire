const express=require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
// const multer  = require('../middleware/multer-config');
const { upload, resizeImag } = require('../middleware/multer-config');

router.post('/',auth, upload , resizeImag , bookCtrl.createBook);   
router.put('/:id',auth, upload , resizeImag , bookCtrl.modifyBook );
router.delete('/:id',auth, bookCtrl.deleteBook); 
router.get('/:id', bookCtrl.getOneBook );
router.get('/', bookCtrl.getAllBooks );

// router.get ('/bestrating', bookCtrl.getBestRating);

module.exports = router;