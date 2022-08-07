const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const controllerMission = require("../controllers/MissionController");

router.post("/", auth, multer, controllerMission.createMission);

router.get("/", auth, controllerMission.getMissions);

router.get("/:id", auth, controllerMission.getMission);

router.patch("/:id", auth, multer, controllerMission.updateMission);

router.delete("/:id", auth, controllerMission.deleteMission);

module.exports = router;
