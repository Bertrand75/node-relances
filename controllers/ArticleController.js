const Article = require("../models/Article");

// POST création d'un article
exports.createArticle = async (req, res) => {
  try {
    let article = {
      ...req.body,
      idUser: req.payload.id,
    };

    let newArticle = await Article.create(article);
    res.status(201).json({
      item: newArticle,
      message: `L'article a bien été créé`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création du sujet`,
    });
  }
};

// GET récupérer tous les articles

exports.getArticles = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let articles = await Article.find().where("idUser").equals(idUser);
    if (articles.length > 0) {
      res.json(articles);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé d'articles" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET récupérer un article avec son id

exports.getArticle = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let article = await Article.findById(id).where("idUser").equals(idUser);
    if (article) {
      res.json(article);
    } else {
      res.status(400).json({
        message: "Cet article n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET récupérer un article avec son id

exports.getLastArticle = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let article = await Article.findOne({ sort: { creationDate: -1 } })
      .where("idUser")
      .equals(idUser);
    if (article) {
      res.json(article);
    } else {
      res.status(400).json({
        message: "Il n'y a pas d'article dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// PATCH modification d'un article
exports.updateArticle = async (req, res) => {
  try {
    let { id } = req.params;
    let article = await Article.findById(id);
    if (article) {
      if (article.idUser == req.payload.id) {
        let body = { ...req.body };
        let articleUp = await Article.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        );
        res.json({
          item: articleUp,
          message: `L'article a bien été mis à jour`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à modifier cet article",
        });
      }
    } else {
      res.status(400).json({
        message: "Cet article n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// DELETE (supprimer un article avec son id)
exports.deleteArticle = async (req, res) => {
  try {
    // let { id: idUser } = req.payload;
    let { id: idArticle } = req.params;
    let article = await Article.findById(idArticle);
    if (article) {
      //  if (article.idUser == idUser) {
      let deletedArticle = await article.deleteOne();
      res.json({
        deletedArticle,
        message: `L'article a bien été supprimé`,
      });
      // } else {
      //   res.status(401).json({
      //     message: "Vous n'êtes pas autorisé à supprimer cet article",
      //   });
      // }
    } else {
      res.status(400).json({
        message: "Cet article n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
