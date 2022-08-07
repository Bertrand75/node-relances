const Newspaper = require("../models/Newspaper");

// POST ( création d'un journal puis renvoi de ses données )

exports.createNewspaper = async (req, res) => {
  try {
    let newspaper = {
      ...req.body,
      idUser: req.payload.id,
    };
    let newNewspaper = await Newspaper.create(newspaper);
    res.status(201).json({
      item: newNewspaper,
      message: `Le journal "${newNewspaper.name}" a bien été ajouté`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création du journal`,
    });
  }
};

// GET (récupérer un journal de l'utilisateur loggé avec son id)
exports.getNewspaper = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let newspaper = await Newspaper.findById(id).where("idUser").equals(idUser);
    if (newspaper) {
      res.json(newspaper);
    } else {
      res.status(400).json({
        message: "Ce journal n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer un journal de l'utilisateur loggé avec son id)
exports.getNewspaperByName = async (req, res) => {
  try {
    let { name } = req.params;
    let idUser = req.payload.id;
    let newspaper = await Newspaper.findOne({ name: name })
      .where("idUser")
      .equals(idUser);
    if (newspaper) {
      res.json(newspaper);
    } else {
      res.status(400).json({
        message: "Ce journal n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les journaux de l'utilisateur loggé)
exports.getNewspapers = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let newspapers = await Newspaper.find().where("idUser").equals(idUser);
    if (newspapers.length > 0) {
      res.json(newspapers);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches journaux" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer un journal avec son id)
exports.deleteNewspaper = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idNewspaper } = req.params;
    let newspaper = await Newspaper.findById(idNewspaper);
    if (newspaper) {
      if (newspaper.idUser == idUser) {
        let deletedNewspaper = await newspaper.deleteOne();
        res.json({
          deletedNewspaper,
          message: `Le journal "${deletedNewspaper.name}" a bien été supprimé`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à supprimer la fiche de ce journal",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce journal n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PUT (mettre à jour un journal avec son id)
exports.updateNewspaper = async (req, res) => {
  try {
    let { id } = req.params;
    let newspaper = await Newspaper.findById(id);
    if (newspaper) {
      if (newspaper.idUser == req.payload.id) {
        let body = { ...req.body };
        let newspaperUp = await Newspaper.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        );
        res.json({
          item: newspaperUp,
          message: `Le journal "${newspaperUp.name}" a bien été mis à jour`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à modifier la fiche de ce journal",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce journal n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
