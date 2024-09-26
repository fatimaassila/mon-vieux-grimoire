const multer = require('multer');
const  sharp = require('sharp');
const path = require('path');


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/wepb': 'wepb'

};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({storage: storage}).single('image');

// Redimensionnez les images téléchargées avant de les enregistrer dans la base de données.
const resizeImag = (req, res, next) => {
  // vérifie si'l y a un fichier dans la requete
  if (!req.file) {
    return next();
  }
//   // Si oui, redimensionne l'image avec Sharp.
  const fileName = req.file.filename;
  const filePath = req.file.path;
  const resizedFilePath = path.join('images', `resized_${fileName}`);
  sharp(filePath)
    .resize({ width:206, height: 260 })
    .toFormat('avif')
    .toFile(resizedFilePath)
    .then(() => {
       // On met à jour le chemin vers l'img redimensionne
      req.file.path = resizedFilePath;
      req.file.filename =fileName;
        next();
    })
    .catch(error => res.status(500).json({ error })); 
};

module.exports = { upload, resizeImag };