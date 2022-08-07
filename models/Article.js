const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  content: {
    type: String,
    required: [true, "Un contenu est obligatoire"],
    trim: true,
  },
  creationDate: { type: Date, default: Date.now },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
