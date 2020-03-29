const express = require("express");

const IncidentController = require("./controllers/IncidentController");
const OngController = require("./controllers/OngController");
const OngProfileController = require("./controllers/OngProfileController");
const SessionController = require("./controllers/SessionController");

const routes = express.Router();

routes.post("/sessions", SessionController.store);

routes.get("/ongs", OngController.index);
routes.post("/ongs", OngController.store);

routes.get("/profile", OngProfileController.index);

routes.get("/incidents", IncidentController.index);
routes.post("/incidents", IncidentController.store);
routes.delete("/incidents/:id", IncidentController.delete);

module.exports = routes;
