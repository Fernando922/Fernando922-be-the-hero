const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");

const IncidentController = require("./controllers/IncidentController");
const OngController = require("./controllers/OngController");
const OngProfileController = require("./controllers/OngProfileController");
const SessionController = require("./controllers/SessionController");

const routes = express.Router();

routes.post("/sessions", celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().required()
  })
}),  SessionController.store);

routes.get("/ongs", OngController.index);


routes.post(
  "/ongs",
  celebrate({
    [Segments.BODY]: Joi.object().keys({   //variavel como parametro de um objeto é passada entre chaves
      name: Joi.string().required(),
      email: Joi.string()
        .required()
        .email(),
      whatsapp: Joi.string()
        .required()
        .length(11),
      city: Joi.string().required(),
      uf: Joi.string()
        .required()
        .length(2)
    })
  }),
  OngController.store
);

routes.get("/profile",celebrate({
  [Segments.HEADERS]: Joi.object({  //validação dos headers muda um pouco
    authorization: Joi.string().required()
  }).unknown()  //porque vc nao sabe todos os headers que virao na requisição
}), OngProfileController.index);

routes.get("/incidents", celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number()
  })
}), IncidentController.index);


routes.post("/incidents", celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    value: Joi.string().required()
  })
}),IncidentController.store);



routes.delete("/incidents/:id", celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().required()
  })
}), IncidentController.delete);

module.exports = routes;
