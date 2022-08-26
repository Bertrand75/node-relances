const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST ( inscription d'un utilisateur )
exports.signup = async (req, res) => {
  try {
    console.log(req.body.role);
    req.body.role = "NORMAL"; // par sécurité

    const user = await User.create(req.body);
    let token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
      expiresIn: 1000 * 60 * 60 * 5,
    });
    res.status(201).json({
      token,
      message: "Utilisateur créé",
      user: { id: user.id, firstname: user.prenom },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST ( connexion d'un utilisateur )
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne().where("email").equals(email);
    if (user) {
      let isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        let token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.PRIVATE_KEY
        );

        res.json({
          message: "Connexion établie",
          token,
          user: { id: user.id, pseudo: user.pseudo },
        });
        console.log("Connexion établie");
      } else {
        res.status(400).json({ message: "Mot de passe incorrect" });
        console.log("Mot de passe incorrect");
      }
    } else {
      res.status(400).json({ message: "l'adresse email n'existe pas" });
      console.log("l'adresse email n'existe pas");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ( récupérer un utilisateur avec son id )
exports.getUsers = async (req, res) => {
  try {
    let users = await User.find().select("-password");
    if (users) {
      res.json(users);
    } else {
      res
        .status(400)
        .json({ message: "Il n'y a pas d'utilisateurs enregistrés" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ( récupérer un utilisateur avec son id )
exports.getUser = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ message: "L'id de l'utilisateur n'existe pas" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE (supprimer un utilisateur avec son id)
exports.deleteUser = async (req, res) => {
  try {
    // let { id: idAdmin } = req.payload;
    let { id: idUser } = req.params;
    let user = await User.findById(idUser);
    if (user) {
      //if (client.idUser == idUser) {
      let deletedUser = await user.deleteOne();
      res.json({
        deletedUser,
        message: `L'utilisateur "${user.nom}" a bien été supprimé`,
      });
      // } else {
      // res.status(401).json({
      //   message: "Vous n'êtes pas autorisé à supprimer la fiche de ce client",
      // });
      //}
    } else {
      res.status(400).json({
        message: "Cet utilisateur n'est pas présent dans la base de données",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Une erreur est survenue au niveau du serveur" });
  }
};

// PATCH ( mettre à jour un user avec son id )
exports.updateUser = async (req, res) => {
  try {
    let { id } = req.params;

    if (req.payload.role !== "ADMIN") {
      // Vérification supplémentaire visant à empecher un utilisateur normal de modifier son status
      req.body.role = "NORMAL";
    }
    let user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // retourne la nouvelle valeur au lieu de la précédente
    ).select("-password");
    if (user) {
      res.json({
        item: user,
        message: `L'utilisateur "${user.pseudo}" a bien été mis à jour`,
      });
    } else {
      res.status(400).json({ message: "L'id de l'utilisateur n'existe pas" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
