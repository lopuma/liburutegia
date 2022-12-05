const {
    isAuthenticated
} = require("../../controller/authController/loginController");

const {
    noExistPartner,
} = require("../../controller/apiController/Partner.controller.api");

const {
    getNew,
    getInfo,
} = require("../../controller/workSpaceController/Partners.controller");

// TODO 👌 
const routerParters = require("express").Router();
    
    routerParters.get("/new", isAuthenticated, getNew);

    routerParters.get("/info/:idPartner", isAuthenticated, noExistPartner, getInfo);

module.exports = routerParters;
