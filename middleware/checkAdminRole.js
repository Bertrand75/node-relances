const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (req.payload.role === "ADMIN") {
      next();
      return;
    } else {
      res.status(401).json({ message: "Accès non autorisé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Utilisateur non reconnu" });
  }
};
