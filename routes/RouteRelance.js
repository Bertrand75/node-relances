const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controllerRelance = require("../controllers/RelanceController");

// Création  d'une relance
router.post("/", auth, controllerRelance.createRelance);
// Récupération de toutes les relances
router.get("/", auth, controllerRelance.getRelances);
// Récupération des relances liées à une mission (dont l'id est spécifié)
router.get("/:missionid", auth, controllerRelance.getMissionRelances);
// Récupération d'une relance (dont l'id est spécifié)
router.get("/:id", auth, controllerRelance.getRelance);
// Mise à jour d'une relance (dont l'id est spécifié)
router.patch("/:id", auth, controllerRelance.updateRelance);
// Suppression d'une relance (dont l'id est spécifié)
router.delete("/:id", auth, controllerRelance.deleteRelance);

module.exports = router;
