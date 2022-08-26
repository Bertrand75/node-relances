const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const controllerJournalist = require("../controllers/JournalistController");

// Création  d'un journaliste
router.post("/", auth, multer, controllerJournalist.createJournalist);
// Récupération de tous les journalistes
router.get("/", auth, controllerJournalist.getJournalists);
// Récupération d'un journaliste sont le prenom et le nom sont spécifiés
router.get(
  "/:firstname/:lastname",
  auth,
  controllerJournalist.getJournalistByName
);
// Récupération des journaux dans lequel travaille un journaliste
router.get(
  "/newspaper/:id",
  auth,
  controllerJournalist.getJournalistNewspapers
);
// Récupération d'un journaliste par son id
router.get("/:id", auth, controllerJournalist.getJournalist);
// Mise à jour d'un journaliste spécifié par son id
router.patch("/:id", auth, multer, controllerJournalist.updateJournalist);
// Suppression d'un journaliste
router.delete("/:id", auth, controllerJournalist.deleteJournalist);

module.exports = router;
