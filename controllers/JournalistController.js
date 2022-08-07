const Journalist = require("../models/Journalist");
const fs = require("fs/promises");
const Relance = require("../models/Relance");

// POST ( création d'un journaliste puis renvoi de ses données )

exports.createJournalist = async (req, res) => {
  try {
    let journalist = {
      ...req.body,
      idUser: req.payload.id,
    };

    // Les tableaux (clés étrangères) sont récupérés sous forme de chaine
    // On les reconverti en tableaux si plus de 1 élément
    if (journalist.topics) {
      journalist.topics = journalist.topics.split(",");
    }
    if (journalist.newspapers) {
      journalist.newspapers = journalist.newspapers.split(",");
    }

    if (req.file) {
      journalist = {
        ...journalist,
        photo: req.file.filename,
      };
    }
    let newJournalist = await Journalist.create(journalist);
    try {
      newJournalist = await newJournalist.populate(["newspapers", "topics"]);
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({
      item: newJournalist,
      message: `Le journaliste "${newJournalist.firstname} ${newJournalist.lastname}" a bien été ajouté`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création du journaliste`,
    });
  }
};

// GET (récupérer un journaliste de l'utilisateur loggé avec son id)
exports.getJournalist = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let journalist = await Journalist.findById(id)
      .where("idUser")
      .equals(idUser)
      .populate("newspapers")
      .populate("topics");
    if (journalist) {
      res.json(journalist);
    } else {
      res.status(400).json({
        message: "Ce journaliste n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer un journaliste de l'utilisateur loggé avec son prénom et son nom)
exports.getJournalistByName = async (req, res) => {
  try {
    let { lastname, firstname } = req.params;
    let idUser = req.payload.id;
    let journalist = await Journalist.findOne({
      firstname: firstname,
      lastname: lastname,
    })
      .where("idUser")
      .equals(idUser);
    if (journalist) {
      res.json(journalist);
    } else {
      res.status(400).json({
        message: "Ce journaliste n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// GET (récupérer tous les journaux dans lequel travaille un journaliste de l'utilisateur loggé)
exports.getJournalistNewspapers = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let journalist = await Journalist.findById(id)
      .where("idUser")
      .equals(idUser)
      .populate("newspapers");
    if (journalist) {
      if (journalist.newspapers) {
        res.json(journalist.newspapers);
      } else {
        res.status(400).json({
          message: "Ce journaliste n'est rattaché à aucun journal",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce journaliste n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer tous les journalistes de l'utilisateur loggé)
exports.getJournalists = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let journalists = await Journalist.find()
      .where("idUser")
      .equals(idUser)
      .populate("newspapers")
      .populate("topics")
      .populate("missions")
      .populate("relances");
    if (journalists.length > 0) {
      res.json(journalists);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches journaliste" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer une fiche journaliste avec son id)
exports.deleteJournalist = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idJournalist } = req.params;
    let journalist = await Journalist.findById(idJournalist);
    if (journalist) {
      if (journalist.idUser == idUser) {
        let deletedJournalist = await journalist.deleteOne();
        if (journalist.photo) {
          await fs.unlink("./uploads/" + journalist.photo);
        }

        res.json({
          deletedJournalist,
          message: `Le journaliste "${deletedJournalist.firstname} ${deletedJournalist.lastname}" a bien été supprimé`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à supprimer la fiche de ce journaliste",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce journaliste n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PATCH (mettre à jour un journaliste avec son id)
exports.updateJournalist = async (req, res) => {
  try {
    let { id } = req.params;
    let journalist = await Journalist.findById(id);
    if (journalist) {
      if (journalist.idUser == req.payload.id) {
        let body = { ...req.body };
        // Les tableaux (clés étrangères) sont récupérés sous forme de chaine
        // On les reconvertie en tableaux si plus de 1 élément
        if (body.topics) {
          body.topics = body.topics.split(",");
        }
        if (body.newspapers) {
          body.newspapers = body.newspapers.split(",");
        }
        if (req.file) {
          body = { ...body, photo: req.file.filename };
        }
        let journalistUp = await Journalist.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        )
          .populate("newspapers")
          .populate("topics")
          .populate("missions")
          .populate("relances");
        if (req.file) {
          await fs.unlink("./uploads/" + journalist.photo);
        }
        res.json({
          item: journalistUp,
          message: `Le journaliste "${journalistUp.firstname} ${journalistUp.lastname}" a bien été mis à jour`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à modifier la fiche de ce journaliste",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce journaliste n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
