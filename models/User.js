const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: [true, "Un nom d'utilisateur est obligatoire"],
      trim: true,
      minlength: 2,
      maxlength: 80,
      unique: [
        true,
        "Ce nom d'utilisateur est indisponible, veuillez en indiquer un autre",
      ],
    },
    nom: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    prenom: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "L' adresse email est obligatoire"],
      unique: [
        true,
        "Cette adresse email est déjà prise, veuillez en indiquer une autre",
      ],
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 80,
      validate: [isEmail],
    },
    password: {
      type: String,
      required: [true, "Un mot de passe est nécéssaire"],
      trim: true,
      minlength: 6,
      maxlength: 1024,
    },
    role: { type: String, enum: ["NORMAL", "ADMIN"], default: "NORMAL" },
  },
  { timestamps: true }
);

// Fonction qui crypte le mot de passe avant la sauvegarde dans la base de données
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    let passwordHashed = await bcrypt.hash(this.password, salt);
    this.password = passwordHashed;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
