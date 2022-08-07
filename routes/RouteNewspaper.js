const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controllerNewspaper = require("../controllers/NewspaperController");

router.post("/", auth, controllerNewspaper.createNewspaper);

router.get("/", auth, controllerNewspaper.getNewspapers);

router.get("/name/:name", auth, controllerNewspaper.getNewspaperByName);

router.get("/:id", auth, controllerNewspaper.getNewspaper);

router.patch("/:id", auth, controllerNewspaper.updateNewspaper);

router.delete("/:id", auth, controllerNewspaper.deleteNewspaper);

module.exports = router;
