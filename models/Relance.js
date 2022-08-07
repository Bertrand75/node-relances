const mongoose = require("mongoose");

const relanceSchema = new mongoose.Schema({
  //title: { type: String, trim: true },
  journalist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journalist",
    required: [true, "Une relance doit être associée à un journaliste"],
  },
  newspaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Newspaper",
  },
  description: { type: String, trim: true },
  dateLastRelance: { type: Date },
  dateNextRelance: { type: Date },
  interest: { type: Number, min: -1, max: 5, trim: true },
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mission",
    required: [true, "Une relance doit concerner une mission précise"],
  },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id de l'utilisateur qui a créé la relance
});

// Une seule relance par journaliste pour chaque mission
relanceSchema.index(
  {
    journalist: 1,
    mission: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);

const Relance = mongoose.model("Relance", relanceSchema);

module.exports = Relance;
