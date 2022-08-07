const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controllerClient = require("../controllers/ClientController");

router.post("/", auth, controllerClient.createClient);

router.get("/", auth, controllerClient.getClients);

router.get("/:id", auth, controllerClient.getClient);

router.patch("/:id", auth, controllerClient.updateClient);

router.delete("/:id", auth, controllerClient.deleteClient);

module.exports = router;
