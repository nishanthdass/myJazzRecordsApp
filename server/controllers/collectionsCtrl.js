const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = `Select * from Collections;`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('home', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};

exports.insert = function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // console.log(data)


    query1 = `INSERT INTO Collections (name) VALUES ("${data.name}")`;

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
            query2 = `SELECT * FROM Collections;`;
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

    // console.log(data)

    // let collectionName = parseInt(data.collectionName);
    let collectionId = parseInt(data.collectionId);

    console.log(collectionId, data.collectionName)

    queryUpdateWorld = `UPDATE Collections SET name = ? WHERE collection_id = ?`;
    selectWorld = `SELECT * FROM Collections;`

    // Run the 1st query
    db.pool.query(queryUpdateWorld, [data.collectionName, collectionId], function (error, rows, fields) {
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
                    // console.log(rows)
                    res.send(rows);
                }
            })
        }
    })
};



























// exports.edit = (req, res) => {
//     let dataId = req.query.coleditId;
//     let dataName = req.query.coleditName;
//     // console.log(dataId, dataName)
//     let colId = parseInt(dataId)

//     if (isNaN(colId)) {
//         colId = 'NULL'
//     }

//     let query1 = `UPDATE Collections SET name = "${dataName}" WHERE collection_id = ${colId}`;
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/');
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };


















exports.delete = function (req, res, next) {
    console.log("works!!!")
    let data = req.body;
    let personID = parseInt(data.id);
    console.log(personID)


    let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
    let deleteBsg_People = `DELETE FROM bsg_people WHERE id = ?`;
    let query1 = `DELETE FROM Collections WHERE collection_id = ?`;


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

