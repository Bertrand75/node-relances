const mongoose = require("mongoose");
const Relance = require("./Relance");

const journalistSchema = new mongoose.Schema({
  lastname: {
    type: String,
    trim: true,
    required: [true, "Le nom du journaliste est obligatoire"],
    min: [2, `Le nom doit comporter au minimum 2 lettres`],
    max: [
      50,
      `Le nom doit comporter au maximum 50 lettres, celui-ci en a {VALUE}`,
    ],
  },
  firstname: {
    type: String,
    trim: true,
    min: [2, `Le prénom doit comporter au minimum 2 lettres`],
    max: [
      50,
      `Le prénom doit comporter au maximum 50 lettres, celui-ci en a {VALUE}`,
    ],
  },

  genre: { type: String, uppercase: true, enum: ["M.", "MME"] },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 80,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez entrer une adresse email valide",
    ],
  },
  photo: { type: String, maxlength: 500 },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }], // Sujets de predilection du journaliste
  phoneNumber: { type: String },
  phoneNumberDirect: { type: String },
  newspapers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Newspaper" }], // Journaux dans lequel le journaliste travaille
  missions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mission" }], // Missions durant lesquelles ils ont été contactés
  comment: { type: String }, // Commentaires sur le journaliste
  relances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Relance" }], // Etat des relances
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id de l'utilisateur qui a uploadé le journaliste
});

// Il ne peut pas y avoir 2 fois le même journaliste avec le même nom et le même prénom
journalistSchema.index(
  {
    lastname: 1,
    firstname: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);

journalistSchema.index(
  {
    email: 1,
    idUser: 1,
  },
  {
    unique: [true, "Cet email de journaliste est déjà utilisé"],
  }
);

// Supprimer toutes les relances liées à ce journaliste
journalistSchema.pre("deleteOne", { document: true }, async function (next) {
  await Relance.deleteMany({ journalist: this._id }).catch(function (err) {
    console.log(err);
  });
  next();
});

const Journalist = mongoose.model("Journalist", journalistSchema);

module.exports = Journalist;
