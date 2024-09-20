const express=require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');


router.post('/',auth, bookCtrl.creatBook);   
router.put('/:id',auth,bookCtrl.modifyBook );
router.delete('/:id',auth, bookCtrl.deleteBook); 
router.get('/:id',auth, bookCtrl.getOneBook );
router.get('/',auth, bookCtrl.getAllBook );

module.exports = router;