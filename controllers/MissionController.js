const Mission = require("../models/Mission");
const Relance = require("../models/Relance");
const fs = require("fs/promises");

// POST ( création d'une mission puis renvoi de ses données )

exports.createMission = async (req, res) => {
  try {
    let mission = {
      ...req.body,
      idUser: req.payload.id,
    };
    console.log(req.body);

    // Les tableaux (clés étrangères) sont récupérés sous forme de chaine
    // On les reconverti en tableaux si plus de 1 élément
    // if (mission.topics && mission.topics.length > 0) {
    //   mission.topics = mission.topics.split(",");
    // }
    // if (mission.journalists && mission.journalists.length > 0) {
    //   mission.journalists = mission.journalists.split(",");
    // }
    if (req.file) {
      mission = {
        ...mission,
        logo: req.file.filename,
      };
    }
    let newMission = await Mission.create(mission);
    newMission = await newMission.populate(["journalists", "topics", "client"]);

    res.status(201).json({
      item: newMission,
      message: `La mission "${newMission.name}" a bien été ajoutée`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création de la mission`,
    });
  }
};

// GET (récupérer une mission de l'utilisateur loggé avec son id)
exports.getMission = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let mission = await Mission.findById(id)
      .where("idUser")
      .equals(idUser)
      .populate("journalists")
      .populate("topics")
      .populate("client");
    if (mission) {
      res.json(mission);
    } else {
      res.status(400).json({
        message: "Cette mission n'est pas présente dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les missions de l'utilisateur loggé)
exports.getMissions = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let missions = await Mission.find()
      .where("idUser")
      .equals(idUser)
      .populate("journalists")
      .populate("topics")
      .populate("client");
    if (missions.length > 0) {
      res.json(missions);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches mission" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer une mission avec son id)
exports.deleteMission = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idMission } = req.params;
    let mission = await Mission.findById(idMission);
    if (mission) {
      if (mission.idUser == idUser) {
        let deletedMission = await mission.deleteOne();
        if (mission.logo) {
          await fs.unlink("./uploads/" + mission.logo);
        }
        res.json({
          deletedMission,
          message: `La mission "${deletedMission.name}" a bien été supprimée`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à supprimer la fiche de cette mission",
        });
      }
    } else {
      res.status(400).json({
        message: "Cette mission n'est pas présente dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PUT (mettre à jour une mission avec son id)
exports.updateMission = async (req, res) => {
  try {
    let { id } = req.params;
    let mission = await Mission.findById(id);
    if (mission) {
      if (mission.idUser == req.payload.id) {
        let body = { ...req.body };

        if (req.file) {
          body = { ...body, logo: req.file.filename };
        }

        let missionUp = await Mission.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        )
          .populate("journalists")
          .populate("topics")
          .populate("client");
        res.json({
          item: missionUp,
          message: `La mission ${mission.name} a bien été mise à jour`,
        });
      } else {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à modifier la fiche de cette mission",
        });
      }
    } else {
      res.status(400).json({
        message: "Cette mission n'est pas présente dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
