const { isAuthenticated } = require('../../controller/authController/loginController')
const { getBooks, getBookings, getPartners, getAdmin } = require('../../controller/workSpaceController/workSpaceController')

// TODO 👌 
const routerWorkSpace = require("express").Router();

    routerWorkSpace.get("/books", isAuthenticated, getBooks);

    routerWorkSpace.get("/bookings", isAuthenticated, getBookings);

    routerWorkSpace.get("/admin", isAuthenticated, getAdmin);

    routerWorkSpace.get("/partners", getPartners);

module.exports = routerWorkSpace;