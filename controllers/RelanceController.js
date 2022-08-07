const Relance = require("../models/Relance");

// POST ( création d'une relance puis renvoi de ses données )

exports.createRelance = async (req, res) => {
  try {
    let relance = {
      ...req.body,
      idUser: req.payload.id,
    };
    let newRelance = await Relance.create(relance);
    newRelance = await newRelance.populate([
      "journalist",
      "mission",
      "newspaper",
    ]);

    res.status(201).json({
      item: newRelance,
      message: `La relance a bien été créée`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création de la relance`,
    });
  }
};

// GET (récupérer une relance de l'utilisateur loggé avec son id)
exports.getRelance = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let relance = await Relance.findById(id)
      .where("idUser")
      .equals(idUser)
      .populate("journalist")
      .populate("newspaper")
      .populate("mission");
    if (relance) {
      res.json(relance);
    } else {
      res.status(400).json({
        message: "Cette relance n'est pas présente dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les relances de l'utilisateur loggé)
exports.getRelances = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let relances = await Relance.find()
      .where("idUser")
      .equals(idUser)
      .populate("journalist")
      .populate("newspaper")
      .populate("mission");
    if (relances.length > 0) {
      res.json(relances);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches relance" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les relances liées à une mission de l'utilisateur loggé)
exports.getMissionRelances = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let { missionid } = req.params;
    let relances = await Relance.find()
      .where("idUser")
      .equals(idUser)
      .where("mission")
      .equals(missionid)
      .populate("journalist")
      .populate("newspaper")
      .populate("mission");
    if (relances.length > 0) {
      res.json(relances);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches relance" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer une relance avec son id)
exports.deleteRelance = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idRelance } = req.params;
    let relance = await Relance.findById(idRelance);
    if (relance) {
      if (relance.idUser == idUser) {
        let deletedRelance = await relance.remove();
        res.json({
          deletedRelance,
          message: `La relance a bien été supprimée`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à supprimer la fiche de cette relance",
        });
      }
    } else {
      res.status(400).json({
        message: "Cette relance n'est pas présente dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PUT (mettre à jour une relance avec son id)
exports.updateRelance = async (req, res) => {
  try {
    let { id } = req.params;
    let relance = await Relance.findById(id);
    if (relance) {
      if (relance.idUser == req.payload.id) {
        let body = { ...req.body };
        let relanceUp = await Relance.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        )
          .populate("journalist")
          .populate("newspaper")
          .populate("mission");
        res.json({
          item: relanceUp,
          message: `La relance a bien été mise à jour`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à modifier la fiche de cette relance",
        });
      }
    } else {
      res.status(400).json({
        message: "Cette relance n'est pas présente dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
