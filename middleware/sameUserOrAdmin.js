const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (req.payload.role === "ADMIN") {
      next();
      return;
    } else if ("/" + req.payload.id === req.path) {
      console.log("req.path");
      console.log(req.path);
      next();
      return;
    } else {
      res.status(401).json({ message: "Accès non autorisé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Utilisateur non reconnu" });
  }
};
