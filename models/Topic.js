const mongoose = require("mongoose");
const Journalist = require("./Journalist");
const Newspaper = require("./Newspaper");

// Sujets

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "L'intitulé du sujet est obligatoire"],
    uppercase: true,
    minlength: 2,
    maxlength: 50,
  },
  description: { type: String, minlength: 2, maxlength: 1000 },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id de l'utilisateur qui a créé le sujet
});
topicSchema.index(
  {
    name: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);
// Supression du sujet de la liste des sujets des journalistes et des journaux
topicSchema.pre("deleteOne", { document: true }, async function (next) {
  // Recherche des journalistes qui traitent ce sujet
  let topicJournalistList = await Journalist.find({
    topics: { $in: this._id },
  }).catch(function (err) {
    console.log(err);
  });
  // Retrait de ce sujet de la liste des sujets du journaliste
  for (const topicJournalist of topicJournalistList) {
    await newspaperJournalist
      .updateOne({
        $pull: { newspapers: this._id },
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  // Idem pour les journaux
  let topicNewspaperList = await Newspaper.find({
    topics: { $in: this._id },
  }).catch(function (err) {
    console.log(err);
  });
  for (const newspaperList of topicNewspaperList) {
    await newspaperList
      .updateOne({
        $pull: { topics: this._id },
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  next();
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
