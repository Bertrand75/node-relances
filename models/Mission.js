const mongoose = require("mongoose");
const Relance = require("./Relance");

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Le nom de la mission est obligatoire"],
    minlength: 1,
    maxlength: 50,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "Le nom du client est obligatoire"],
    minlength: 1,
    maxlength: 100,
  },
  journalists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journalist" }],
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  dateStart: { type: Date },
  dateEnd: { type: Date },
  comment: { type: String },
  logo: { type: String },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id de l'utilisateur qui a créé la mission
});

missionSchema.index(
  {
    name: 1,
    idUser: 1,
  },
  {
    unique: true,
  }
);

// Supprimer toutes les relances liées à cette mission
// Cas d'une requete deleteOne directe
missionSchema.pre("deleteOne", { document: true }, async function (next) {
  await Relance.deleteMany({ mission: this._id }).catch(function (err) {
    console.log(err);
  });
  next();
});
// Cas d'une requete en chaine provoquée par l'effacement d'un parent
missionSchema.pre("deleteMany", { query: true }, async function (next) {
  let missions = await Mission.find(this._conditions).catch(function (err) {
    console.log(err);
  });
  let missionsIds = missions.map((mission) => mission._id);
  await Relance.deleteMany({ mission: { $in: missionsIds } });

  next();
});

const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
