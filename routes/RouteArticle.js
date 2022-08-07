const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkAdminRole = require("../middleware/checkAdminRole");
const controllerArticle = require("../controllers/ArticleController");

router.post("/", auth, checkAdminRole, controllerArticle.createArticle);

router.get("/", auth, checkAdminRole, controllerArticle.getArticles);

router.get("/last", auth, controllerArticle.getLastArticle);

router.get("/:id", auth, checkAdminRole, controllerArticle.getArticle);

router.patch("/:id", auth, checkAdminRole, controllerArticle.updateArticle);

router.delete("/:id", auth, checkAdminRole, controllerArticle.deleteArticle);

module.exports = router;
