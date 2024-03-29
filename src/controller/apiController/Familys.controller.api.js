const connection = require("../../../connections/database/db-connect");

const familyController = {

    getFamily: async (req, res) => {
        const dni = req.params.dniPartner;
        try {
            const sqlSelect = " SELECT p.dni as partnerDni FROM familys f LEFT JOIN partners p ON f.partnerDNI=p.dni WHERE f.familyDni=?";
            connection.query(sqlSelect, dni, (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        code: 400,
                        message: err
                    })
                }
                if (results.length === 0) {
                    return res
                        .status(200)
                        .send({
                            success: true,
                            message: "No family found with this DNI",
                            data: null
                        });
                }
                res
                    .status(200)
                    .send({
                        success: true,
                        message: "Family found with this DNI",    
                        data: results[0]
                    })
            });
        } catch (error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },
    desFamily: async (req, res) => {
        try {
            const familyID = req.params.idFamily;
            const { familyDni, partnerDni } = req.body;
            const sqlUnbind = "DELETE FROM familys WHERE familyDni=? AND partnerDni=?";
            connection.query(sqlUnbind, [ partnerDni, familyDni ], async (err, results) => {
                if (err) {
                    console.error("[ DB ]", err.sqlMessage);
                    return res.status(400).send({
                        success: false,
                        messageErrBD: err,
                        errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                    });
                }
                const sqlExists = "SELECT * FROM familys WHERE familyDni = ?";
                connection.query(sqlExists, partnerDni, async (err, results) => {
                    if (err) {
                        console.error("[ DB ]", err.sqlMessage);
                        return res.status(400).send({
                            success: false,
                            messageErrBD: err,
                            errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                        });
                    }
                    if (results.length === 0) {
                        const sqlUpdateActiveFamily = "UPDATE partners SET activeFamily=0 WHERE dni=?";
                        connection.query(sqlUpdateActiveFamily, partnerDni, (err, results) => {
                            if (err) {
                                console.error("[ DB ]", err.sqlMessage);
                                return res.status(400).send({
                                    success: false,
                                    messageErrBD: err,
                                    errorMessage: `[ ERROR DB ] ${err.sqlMessage}`
                                });
                            };
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        messageSuccess: `The family member with DNI: ${familyDni}, has been separated from the partner with DNI : ${partnerDni}`
                    });
                });
            });
        } catch(error) {
            console.error(error);
            res.status(500).redirect("/");
        }
    },

};

module.exports = familyController;
