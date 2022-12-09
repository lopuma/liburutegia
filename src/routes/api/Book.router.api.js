const { 
    getBooks, 
    getBook, 
    deliverBook, 
    addBook, 
    noExistBook, 
    deleteBook, 
    putBook 
} = require('../../controller/apiController/Books.controller.api');

const routerBooks = require('express').Router();
    
routerBooks.get("/", getBooks);

    routerBooks.get("/:id_book", getBook);

    routerBooks.post("/deliver/:id_book", deliverBook);

    //ADD
    //routerBooks.post("/add", addBook);

    //DELETE
    routerBooks.get("/delete/:idBook", deleteBook);

    // UPDATE
    //routerBooks.put("/update/:id_book", noExistBook, putBook);

module.exports = routerBooks;