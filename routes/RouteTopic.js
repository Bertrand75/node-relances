const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controllerTopic = require("../controllers/TopicController");

router.post("/", auth, controllerTopic.createTopic);

router.get("/", auth, controllerTopic.getTopics);

router.get("/name/:name", auth, controllerTopic.getTopicByName);

router.get("/:id", auth, controllerTopic.getTopicById);

router.patch("/:id", auth, controllerTopic.updateTopic);

router.delete("/:id", auth, controllerTopic.deleteTopic);

module.exports = router;
