const jwt = require("jsonwebtoken");
const { searchData } = require("./dbConfig");

async function verifyToken(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(400).json({ error: "Please Login !" });

  //Check if the token is in InvalidToken DataBase
  checkInvalidToken = await searchData("expiredTokens", { token: token });
  if (checkInvalidToken.length > 0) {
    invalidToken = checkInvalidToken[0].token;
    if (invalidToken === token) return res.status(400).json({ error: "You are logged out!" });
  }

  //Verify token and Allow access if Everything is good
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Please Login !" });
  }
}
module.exports = { verifyToken };
