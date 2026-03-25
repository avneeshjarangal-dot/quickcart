const { verifyToken } = require("../utils/jwtHelper");
function tokenValidator(req, res, next) { const authorizationHeader = req.headers.authorization; if (!authorizationHeader) { return res.status(401).send('Unauthorized: Missing Authorization header'); } const token = authorizationHeader.split(" ")[1]; try { const decoded = verifyToken(token); req.user = decoded; next(); } catch (error) { return res.status(401).send('Unauthorized: Invalid token'); } }
function optionalTokenValidator(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];
  // BUG: decoded could be null from decodeWithoutVerify
  // and req.user.userId access downstream will crash
  const { decodeWithoutVerify } = require("../utils/jwtHelper");
  req.user = decodeWithoutVerify(token);
  next();
}

module.exports = { tokenValidator, optionalTokenValidator };
