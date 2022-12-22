const {
  getFamily,
  desFamily
} = require("../../controller/apiController/Familys.controller.api");

const {
  isAuthenticated
} = require("../../controller/authController/loginController");


const routerFamilys = require("express").Router();
  
  routerFamilys.get("/:dniPartner", getFamily);

  routerFamilys.post("/unbind/:idFamily", desFamily);

module.exports = routerFamilys;
