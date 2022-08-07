require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: "GET, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(express.static("uploads"));

const mongoose = require("mongoose");

// --------------  CONNEXION A LA BDD --------------

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB établie"))
  .catch((err) => {
    console.log("Echec de la connexion à MongoDB");
    console.log(err);
  });

// --------------  ROUTES --------------

const RouteUser = require("./Routes/RouteUser");
const RouteJournalist = require("./Routes/RouteJournalist");
const RouteMission = require("./Routes/RouteMission");
const RouteNewspaper = require("./Routes/RouteNewspaper");
const RouteRelance = require("./Routes/RouteRelance");
const RouteTopic = require("./Routes/RouteTopic");
const RouteClient = require("./Routes/RouteClient");
const RouteArticle = require("./Routes/RouteArticle");

app.use("/api/user", RouteUser);
app.use("/api/journalist", RouteJournalist);
app.use("/api/mission", RouteMission);
app.use("/api/newspaper", RouteNewspaper);
app.use("/api/relance", RouteRelance);
app.use("/api/topic", RouteTopic);
app.use("/api/client", RouteClient);
app.use("/api/article", RouteArticle);

// --------------  SERVEUR --------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
