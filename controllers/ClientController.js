const Client = require("../models/Client");

// POST ( création d'un client puis renvoi de ses données )

exports.createClient = async (req, res) => {
  try {
    let client = {
      ...req.body,
      idUser: req.payload.id,
    };
    let newClient = await Client.create(client);
    res.status(201).json({
      item: newClient,
      message: `Le client "${newClient.nom}" a bien été ajouté`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: `Le serveur a rencontré une erreur lors de la création du sujet`,
    });
  }
};

// GET (récupérer un client de l'utilisateur loggé avec son id)
exports.getClient = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.payload.id;
    let client = await Client.findById(id).where("idUser").equals(idUser);
    if (client) {
      res.json(client);
    } else {
      res.status(400).json({
        message: "Ce client n'est pas présent dans votre base de données",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET (récupérer les clients de l'utilisateur loggé)
exports.getClients = async (req, res) => {
  try {
    let idUser = req.payload.id;
    let clients = await Client.find().where("idUser").equals(idUser);
    if (clients.length > 0) {
      res.json(clients);
    } else {
      res
        .status(400)
        .json({ message: "Vous n'avez pas encore créé de fiches clients" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (supprimer un client avec son id)
exports.deleteClient = async (req, res) => {
  try {
    let { id: idUser } = req.payload;
    let { id: idClient } = req.params;
    let client = await Client.findById(idClient);
    if (client) {
      if (client.idUser == idUser) {
        let deletedClient = await client.deleteOne();
        res.json({
          deletedClient,
          message: `Le client "${client.nom}" a bien été supprimé`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à supprimer la fiche de ce client",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce client n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PUT (mettre à jour un client avec son id)
exports.updateClient = async (req, res) => {
  try {
    let { id } = req.params;
    let client = await Client.findById(id);
    if (client) {
      if (client.idUser == req.payload.id) {
        let body = { ...req.body };
        let clientUp = await Client.findByIdAndUpdate(
          id,
          { $set: body },
          { new: true }
        );
        res.json({
          item: clientUp,
          message: `Le client "${clientUp.nom}" a bien été mis à jour`,
        });
      } else {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à modifier la fiche de ce client",
        });
      }
    } else {
      res.status(400).json({
        message: "Ce client n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};
