const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Route pour créer un nouvel utilisateur
router.post('/signup', userCtrl.signup);   

// Route pour se connecter 
router.post('/login',userCtrl.login );

module.exports = router;