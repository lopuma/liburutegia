const router = require("express").Router();
const { reset } = require("nodemon");
const connection = require("../../../database/db");

router.get("/books", async (req, res) => {
  connection.query("SELECT * FROM books", function(err, results) {
    if (err) {
      console.error(err);
      return res.status(404).send(err);
    }
    console.log(JSON.stringify({data:results}));
    res.send(JSON.stringify({data:results}));
  });
});

router.get("/partners", async (req, res) => {
  connection.query("SELECT * FROM partners", function(err, results) {
    if (err) {
      console.error(err);
      return res.status(404).send(err);
    }
    res.send(JSON.stringify({data:results}));
  });
});

router.get("/bookings", async (req, res) => {
	connection.query("SELECT * FROM bookings", function(err, results) {
	  if (err) {
		console.error(err);
		return res.status(404).send(err);
	  }
	  res.send(JSON.stringify({data:results}));
	});
  });

router.put("/books/:id_book", (req, res) => {
  id_book = req.params.id_book;
  title = req.body.title_book;
  author = req.body.author;
  type = req.body.type;
  language = req.body.language;
  console.log("------------", id_book, title, language);
  let sql =
    "UPDATE books SET title = ?, author = ?, type = ?, language = ? WHERE id_book = ?";
  connection.query(sql, [title, author, type, language, id_book], function(
    error,
    result
  ) {
    if (error) {
      throw error;
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

router.get("/books/:id_book", async (req, res) => {
  id_book = req.params.id_book;
  console.log("EL DIS RECIBIDO POR POST ES ", id_book);
  let sql = `SELECT * FROM books WHERE id_book = ${id_book}`;
  await connection.query(sql, (error, results) => {
    if (results.length == ""){
		return res.send({'error' : 'No existe ese ID_BOOK','Info`':'Prueba /api/books, para mirar todos los ID_BOOK'});
	}
	if (error) {
	  throw error;
    } else {
      return res.send(results);
	  ;
    }
  });
});

router.put("/partners/:id_partner", (req, res) => {
  id_partner = req.params.id_partner;
  dni = req.body.dni;
  console.log("-----id_partner -----", id_partner);
  firstname = req.body.firstname;
  lastname = req.body.lastname;
  direction = req.body.direction;
  phone = req.body.phone;
  email = req.body.email;
  let sql =
    "UPDATE partners SET nombre = ?, apellidos = ?, direccion = ?, telefono = ?, email = ? WHERE id_partner = ?";
  connection.query(
    sql,
    [firstname, lastname, direction, phone, email, id_partner],
    function(error, result) {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
});

router.put("/bookings/:id_booking", (req, res) => {
  id_booking = req.params.id_booking;
  dni = req.body.dni;
  console.log("-----id_booking -----", id_booking);
  console.log("-----id_booking -----", dni);
  // let sql = "UPDATE partners SET nombre = ?, apellidos = ?, direccion = ?, telefono = ?, email = ? WHERE id_partner = ?";
  // connection.query(sql, [firstname, lastname, direction, phone, email, id_partner], function (error, result) {
  // 	if (error) {
  // 		throw error;
  // 	} else {
  // 		res.send(result);
  // 	}
  // })
});

module.exports = router;
