const mongoose = require("mongoose");
const Mission = require("./Mission");

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom du client est obligatoire"],
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  nomContact: { type: String, trim: true, minlength: 2, maxlength: 50 },
  prenomContact: { type: String, trim: true, minlength: 2, maxlength: 50 },
  phoneNumber: { type: String, trim: true, minlength: 6, maxlength: 15 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 80,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez entrer une adresse email valide",
    ],
  },
  comment: { type: String, trim: true },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

clientSchema.index(
  {
    nom: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);

// Supprimer toutes les missions liées à ce client lorsque celui-ci est supprimé
clientSchema.pre("deleteOne", { document: true }, async function (next) {
  await Mission.deleteMany({ client: this._id }).catch(function (err) {
    console.log(err);
  });
  next();
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
