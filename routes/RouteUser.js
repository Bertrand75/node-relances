const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkAdminRole = require("../middleware/checkAdminRole");
const controllerUser = require("../controllers/UserController");
const sameUserOrAdmin = require("../middleware/sameUserOrAdmin");

router.post("/signup", controllerUser.signup);

router.post("/login", controllerUser.login);

router.get("/", auth, checkAdminRole, controllerUser.getUsers);

router.get("/authorization", auth, checkAdminRole, (req, res) => {
  res.status(200).json({ message: "Accès autorisé" });
});
router.get("/tokencheck", auth, (req, res) => {
  res.status(200).json({ message: "Accès autorisé" });
});
router.get("/:id", auth, sameUserOrAdmin, controllerUser.getUser);

router.patch("/:id", auth, sameUserOrAdmin, controllerUser.updateUser);

router.delete("/:id", auth, sameUserOrAdmin, controllerUser.deleteUser);

module.exports = router;
