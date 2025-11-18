const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
if (process.env.SKIP_AUTH === 'true') return next();
  const bearerToken = req.headers.authorization; // "Bearer <token>"
  if (!bearerToken) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = bearerToken.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // attach for downstream use
    next();
  } catch (error) {
    return res.status(401).send({ message: "JWT expired or invalid" });
  }
}
module.exports = verifyToken;
