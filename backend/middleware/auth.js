const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, jwtSecret);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
