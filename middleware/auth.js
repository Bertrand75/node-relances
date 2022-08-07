const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.PRIVATE_KEY, function (err, payload) {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        req.payload = payload;
        next();
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "veuillez envoyer le header authorization" });
  }
};
