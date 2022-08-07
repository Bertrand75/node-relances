const mongoose = require("mongoose");
const Journalist = require("./Journalist");

const newspaperSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Le nom du journal est obligatoire"],
    uppercase: true,
    minlength: 1,
    maxlength: 100,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 80,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez entrer une adresse email valide",
    ],
  },
  mediaType: { type: String, trim: true, minlength: 2, maxlength: 15 },
  phoneNumber: { type: String, trim: true, maxlength: 25 },
  description: { type: String, trim: true, minlength: 1, maxlength: 10000 },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }], // Sujets de predilection du journal
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id de l'utilisateur qui a créé la fiche journal
});

newspaperSchema.index(
  {
    name: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);

// Supression du journal de la liste de journaux des journalistes qui y sont reliés
newspaperSchema.pre("deleteOne", { document: true }, async function (next) {
  // Recherche des journalistes qui travaillent dans ce journal
  let newspaperJournalistList = await Journalist.find({
    newspapers: { $in: this._id },
  }).catch(function (err) {
    console.log(err);
  });
  // Retrait de ce journal de la liste des journaux du journaliste ou suppression du journaliste (cas ou le journaliste ne travaille que dans ce journal)
  for (const newspaperJournalist of newspaperJournalistList) {
    if (newspaperJournalist.newspapers.length > 1) {
      await newspaperJournalist.updateOne({
        $pull: { newspapers: this._id },
      });
    } else {
      newspaperJournalist.deleteOne();
    }
  }

  next();
});

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

module.exports = Newspaper;
