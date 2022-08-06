const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


// exports.view = (req, res) => {
//     let query1 = `Select * from Collections;`;
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.render('home', { data: rows });
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };


exports.view = (req, res) => {
    console.log(req)
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.searchName === undefined) {
        query1 = `Select * from Collections;`;
    }


    // // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Collections WHERE name LIKE "%${req.query.searchName}%"`
    }
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('home', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};



exports.viewCol = (req, res) => {
    console.log(req.body)
    // console.log(req)
    let data = req.body

    console.log(data.id)

    let collectionId = parseInt(data.id);

    let query1 = `SELECT Listeners.name AS ListName, Albums.name, Albums.album_id , Performance_Ratings.performances_albums_album_id, SUM(Performance_Ratings.rating) AS rating, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name
    FROM Listeners 
        INNER JOIN Performance_Ratings 
            ON Listeners.collections_collection_id = Performance_Ratings.collections_collection_id
        INNER JOIN Albums
            ON Performance_Ratings.Performances_albums_album_id = Albums.album_id
        INNER JOIN Performances
            ON Albums.album_id = Performances.albums_album_id
        INNER Join Musicians
            ON Performances.musicians_musician_id = Musicians.musician_id
    WHERE Listeners.name = (SELECT name FROM Listeners WHERE collections_collection_id = ${collectionId})
    GROUP BY Musicians.musician_id
    ORDER BY rating DESC;`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            console.log(rows)
            res.send(rows)
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

exports.insert = function (req, res) {
    console.log(req.body)
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

    query1 = `UPDATE Collections SET name = ? WHERE collection_id = ?`;
    query2 = `SELECT * FROM Collections;`

    // Run the 1st query
    db.pool.query(query1, [data.collectionName, collectionId], function (error, rows, fields) {
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
    let personID = parseInt(data.id);
    console.log(personID)


    let query1 = `DELETE FROM Collections WHERE collection_id = ?`;

    db.pool.query(query1, [personID], function (error, rows, fields) {
        if (error) {
            res.status(400).send(error)
        } else {
            res.sendStatus(204)
        }
    })
};

