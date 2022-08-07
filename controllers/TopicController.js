const Topic = require("../models/Topic");

// POST ( création d'un sujet puis renvoi de ses données )

exports.createTopic = async (req, res) => {
  try {
    let topic = {
      ...req.body,
      idUser: req.payload.id,
    };
    let newTopic = await Topic.create(topic);
    res.status(201).json({
      item: newTopic,
      message: `Le sujet "${topic.name}" a bien été créé`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création du sujet`,
    });
  }
};

// GET (récupérer un sujet de l'utilisateur loggé avec son intitulé)
exports.getTopicByName = async (req, res) => {
  try {
    let { name } = req.params;
    let idUser = req.payload.id;
    let topic = await Topic.findOne({ name: name })
      .where("idUser")
      .equals(idUser);
    if (topic) {
      res.json(topic);
    } else {
      res.status(400).json({
        message: "Ce sujet n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer un sujet de l'utilisateur loggé avec son id)
exports.getTopicById = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let topic = await Topic.findById(id).where("idUser").equals(idUser);
    if (topic) {
      res.json(topic);
    } else {
      res.status(400).json({
        message: "Ce sujet n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les sujets de l'utilisateur loggé)
exports.getTopics = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let topics = await Topic.find().where("idUser").equals(idUser);
    if (topics.length > 0) {
      res.json(topics);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches sujets" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer un sujet avec son id)
exports.deleteTopic = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idTopic } = req.params;
    let topic = await Topic.findById(idTopic);
    if (topic) {
      if (topic.idUser == idUser) {
        let deletedTopic = await topic.deleteOne();
        res.json({
          deletedTopic,
          message: `Le sujet "${topic.name}" a bien été supprimé`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à supprimer la fiche de ce sujet",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce sujet n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PUT (mettre à jour un sujet avec son id)
exports.updateTopic = async (req, res) => {
  try {
    let { id } = req.params;
    let topic = await Topic.findById(id);
    if (topic) {
      if (topic.idUser == req.payload.id) {
        let body = { ...req.body };
        let topicUp = await Topic.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        );
        res.json({
          item: topicUp,
          message: `Le sujet ${topicUp.name} a bien été mis à jour`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à modifier la fiche de ce sujet",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce sujet n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
