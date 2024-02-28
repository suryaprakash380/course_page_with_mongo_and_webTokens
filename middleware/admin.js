const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../jwt_code/secret");

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
  if (decodedValue.username) {
    next();
  } else {
    res.status(403).json({
      message: "You are not Authenticated",
    });
  }
}

module.exports = adminMiddleware;
