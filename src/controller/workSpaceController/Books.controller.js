const connection = require("../../../connections/database/db-connect");
const redisClient = require("../../../connections/redis/redis-connect");
const { driveClient, disks } = require("../../../connections/minio/drive-connect");
const config = require("../../config")
const moment = require('moment');
const booksController = {
    getNew: async (req, res) => {
        try {
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            res
                .render("workspace/books/newBook",
                    {
                        loggedIn,
                        rolAdmin
                    });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getInfo: async (req, res) => {
        try {
            const bookID = req.params.idBook || req.body.idBook;
            const loggedIn = req.session.loggedin;
            const rolAdmin = req.session.roladmin;
            const bucketName = config.BUCKET_NAME;
            const sqlSelect = ["SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", "SELECT b.*, FORMAT(AVG(v.score), 2) AS rating, COUNT(v.score) AS numVotes, SUM(v.score) AS totalScore, v.reviewOn FROM votes v LEFT JOIN books b ON b.bookID=v.bookID WHERE b.bookID=? AND v.reviewOn>0", `SELECT p.partnerID AS partnerID, p.dni AS partnerDni, b.reserved as reserved FROM books b INNER JOIN bookings bk ON bk.bookID = b.bookID INNER JOIN partners p ON p.dni = bk.partnerDni WHERE b.bookID=${bookID} AND bk.delivered=0`,`SELECT b.* FROM books b WHERE b.bookID=${bookID}`, `SELECT cb.nameCover as cover FROM books b LEFT JOIN coverBooks cb ON cb.bookID=b.bookID WHERE b.bookID = ${bookID}`];
            connection.query(sqlSelect.join(";"), [bookID], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res
                        .status(400)
                        .send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                }
                let bookData = "";
                if (results[1][0].bookID === null) {
                    const purchase = moment(results[3][0].purchase_date).format("MMMM Do, YYYY");
                    const update = moment(results[3][0].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                    bookData = results[3].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                } else {
                    const purchase = moment(results[1][0].purchase_date).format("MMMM Do, YYYY");
                    const update = moment(results[1][0].lastUpdate).format("MMMM Do, YYYY HH:mm A");
                    bookData = results[1].map(results => ({
                        ...results,
                        purchase_date: purchase,
                        lastUpdate: update
                    }));
                }
                const deliverData = {
                    activeDelivery: results[2][0]
                };
                const nameCover = results[4];
                const objectName = nameCover[0].cover;
                let dataCover;
                if(objectName){
                    driveClient.statObject(bucketName, objectName, async (err, stat) => {
                        if(stat !== undefined){
                            const expirationTime = 5 * 24 * 60 * 60;
                            await driveClient.presignedGetObject(bucketName, objectName, expirationTime, (err, url) => {
                                if (err) {
                                    console.err(err);
                                } else {
                                    dataCover = [{
                                        nameCover: objectName,
                                        urlCover: encodeURIComponent(url)
                                    }];
                                }
                            });
                        } else {
                            dataCover = [{
                                nameCover: null,
                                urlCover: null
                              }];
                        }
                        const dataInfoBook = [ bookData, deliverData, dataCover ];
                        await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), (err, reply) => {
                            if(err) return console.error(err);
                            if(reply) {
                                redisClient.expire(`bookInfo${bookID}`, 28800);
                                res.status(200).render("workspace/books/infoBook", {
                                    loggedIn,
                                    rolAdmin,
                                    bookData,
                                    deliverData,
                                    dataCover
                                });
                            }
                        });
                        
                    });
                } else {
                    const dataCover = [{
                        nameCover: null,
                        urlCover: null
                      }];
                    const dataInfoBook = [ bookData, deliverData, dataCover ];
                    await redisClient.set(`bookInfo${bookID}`, JSON.stringify(dataInfoBook), (err, reply) => {
                        if(err) return console.error(err);
                        if(reply) {
                            redisClient.expire(`bookInfo${bookID}`, 28800);
                            res.status(200).render("workspace/books/infoBook", {
                                loggedIn,
                                rolAdmin,
                                bookData,
                                deliverData,
                                dataCover
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    getBooks: async (req, res) => {
        try {
            connection.query("SELECT * FROM books", async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        swalTitle: "[ Error BD ]",
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                if (results.length === 0) {
                    return res.status(200).send({
                        success: false,
                        swalTitle: "No found....!",
                        errorMessage:
                            "[ ERROR ], There are no data in the table books, Liburutegia.",
                        data: null
                    });
                }
                let data = results;
                await redisClient.set("books", JSON.stringify(data), 'NX', 'EX', 7200, (err, reply) => {
                    if (err) console.error(err)
                    if(reply) res.status(200).send(data);
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
};
module.exports = booksController;