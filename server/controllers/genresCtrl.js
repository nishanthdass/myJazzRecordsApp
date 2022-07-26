// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = `Select * from Genres;`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('genres', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};


exports.insert = function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("Inserting: ", data);


    query1 = `INSERT INTO Genres (name) VALUES ("${data.name}")`;

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
            query2 = `SELECT * FROM Genres;`;
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



exports.edit = function (req, res, next) {
    let data = req.body;

    // let genreName = parseInt(data.genreName);
    let genreId = parseInt(data.genreId);

    queryUpdateWorld = `UPDATE Genres SET name = ? WHERE genre_id = ?`;
    selectWorld = `SELECT * FROM Genres;`

    // Run the 1st query
    db.pool.query(queryUpdateWorld, [data.genreName, genreId], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectWorld, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
};

exports.delete = function (req, res, next) {
    let data = req.body;
    let personID = parseInt(data.id);

    let query1 = `DELETE FROM Genres WHERE genre_id = ?`;

    // Run the 1st query
    db.pool.query(query1, [personID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};






















// const mysql = require('mysql');
// // const { query } = require('express');
// const db = require('../../database/db-connector')


// exports.view = (req, res) => {
//     let query1 = 'Select * from Genres;';
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.render('genres', { data: rows });
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };

// exports.insert = (req, res) => {
//     //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

//     let data = req.body;
//     let query1 = `INSERT INTO Genres (name) VALUES ('${data['input-genName']}');`

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/genres');
//         }
//         else {
//             console.log('database error: \n', console.log(error));

//             res.status(400).send({
//                 status: 400,
//                 error: 'Not found'
//             })

//         }
//     })
// };


// exports.edit = (req, res) => {

//     let dataId = req.query.geneditId;
//     let dataName = req.query.geneditName;

//     console.log(dataId, dataName)
//     let genId = parseInt(dataId)

//     if (isNaN(genId)) {
//         genId = 'NULL'
//     }

//     let query1 = `UPDATE Genres SET name = "${dataName}" WHERE genre_id = ${genId}`;
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/genres');
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };
