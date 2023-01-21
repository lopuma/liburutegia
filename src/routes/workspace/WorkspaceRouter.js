const { isAuthenticated } = require('../../controller/authController/loginController')
const { getBooks, getBookings, getPartners, getAdmin } = require('../../controller/workSpaceController/workSpaceController')

// TODO 👌 
const routerWorkSpace = require("express").Router();

    routerWorkSpace.get("/books", getBooks);

    routerWorkSpace.get("/bookings", getBookings);

    routerWorkSpace.get("/admin", getAdmin);

    //routerWorkSpace.get("/partners", isAuthenticated, getPartners);
    routerWorkSpace.get("/partners", getPartners);

module.exports = routerWorkSpace;