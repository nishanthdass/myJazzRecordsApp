const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Musicians ORDER BY musician_id;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('musicians', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};





exports.insert = function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data)


    let query1 = `INSERT INTO Musicians (first_name, last_name, instrument) VALUES ("${data.first_name}", "${data.last_name}", "${data.instrument}");`


    db.pool.query(query1, function (error, rows, fields) {
        // console.log(rows)
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Musicians ORDER BY musician_id;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    // console.log(rows)
                    res.send(rows);
                }
            })
        }
    })
};

// exports.edit = (req, res) => {
//     let dataId = req.query.musceditId;
//     let dataMuscFn = req.query.musceditFn;
//     let dataMuscLn = req.query.musceditLn;
//     let dataMuscInst = req.query.musceditInst;

//     console.log(dataId, dataMuscFn, dataMuscLn, dataMuscInst)


//     let muscId = parseInt(dataId)
//     if (isNaN(muscId)) {
//         muscId = 'NULL'
//     }


//     let query1 = `UPDATE Musicians SET first_name = "${dataMuscFn}", last_name = "${dataMuscLn}", instrument = "${dataMuscInst}" WHERE musician_id = ${muscId}`;
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/musicians');
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };


exports.edit = function (req, res, next) {
    let data = req.body;

    console.log(data)

    let musicianId = parseInt(data.musician_id);


    query1 = `UPDATE Musicians SET first_name = ?, last_name = ?, instrument = ? WHERE musician_id = ?`;
    query2 = `SELECT * FROM Musicians ORDER BY musician_id;`

    // Run the 1st query
    db.pool.query(query1, [data.first_name, data.last_name, data.instrument, musicianId], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(query2, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // console.log(rows)
                    res.send(rows);
                }
            })
        }
    })
};


exports.delete = function (req, res, next) {
    console.log("works!!!")
    let data = req.body;
    let musicianId = parseInt(data.id);
    console.log(musicianId)

    let query1 = `DELETE FROM Musicians WHERE musician_id = ?`;


    // Run the 1st query
    db.pool.query(query1, [musicianId], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};