// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    // query 1 is a query to get a joined table that includes in additon to musicians id and album id, the album name and musicians name from Musicians and Albums
    let query1 = 'SELECT Performances.performance_id, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name, Performances.albums_album_id, Albums.name From Performances INNER JOIN Musicians ON Performances.musicians_musician_id = Musicians.musician_id INNER JOIN Albums ON Performances.albums_album_id = Albums.album_id ORDER BY performance_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            // if no errors export a render of home page along with object containing row data
            res.render('performances', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

// insert data into database
exports.insert = (req, res) => {
    // request contains data input into the forms field
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;

    let query1 = `INSERT INTO Performances (musicians_musician_id, albums_album_id) VALUES 
    ((SELECT musician_id From Musicians WHERE first_name = '${data.first_name}' AND last_name = '${data.last_name}'), 
    (SELECT album_id from Albums where name = '${data.album_name}'));`;


    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // if insertion is successful send the all rows back so that we can render new row in table
            query2 = 'SELECT Performances.performance_id, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name, Performances.albums_album_id, Albums.name From Performances INNER JOIN Musicians ON Performances.musicians_musician_id = Musicians.musician_id INNER JOIN Albums ON Performances.albums_album_id = Albums.album_id ORDER BY performance_id;';
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
};

// Update a row in database
exports.edit = (req, res) => {
    // request includes row id for the row that is being updated
    let dataId = req.query.perfeditId;
    let dataMusId = req.query.perfmusceditId;
    let dataMusFn = req.query.perfmusceditFn;
    let dataMusLn = req.query.perfmusceditLn;
    let dataPerfAlbId = req.query.perfalbid;
    let dataPerfAlbName = req.query.perfalbname;

    let perfId = parseInt(dataId)
    if (isNaN(perfId)) {
        perfId = 'NULL'
    }

    let query1 = `UPDATE Performances SET musicians_musician_id = (SELECT musician_id from Musicians where first_name = "${dataMusFn}" and last_name = "${dataMusLn}"), albums_album_id = (SELECT album_id from Albums where name = "${dataPerfAlbName}") WHERE performance_id = ${perfId}`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            // if update to db is successful send back all rows so that the appropriate row can be indexed and rendered with updated information
            res.redirect('/performances');
        }
        else {
            // if update to db is unsuccessful send back error so that we can render for user the error in the UI
            res.status(400).send({
                status: 400,
                error: error.sql
            })
        }
    })
};

// Delete a row in the db
exports.delete = function (req, res, next) {
    // request will include the row id for row to be deleted
    let data = req.body;
    let performanceID = parseInt(data.id);

    let query1 = `DELETE FROM Performances WHERE performance_id = ?`;

    db.pool.query(query1, [performanceID], function (error, rows, fields) {
        if (error) {
            res.status(400).send(error)
        } else {
            res.sendStatus(204)
        }
    })
};




















// const mysql = require('mysql');
// // const { query } = require('express');
// const db = require('../../database/db-connector')


// exports.view = (req, res) => {
//     let query1 = 'SELECT Performances.performance_id, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name, Performances.albums_album_id, Albums.name From Performances INNER JOIN Musicians ON Performances.musicians_musician_id = Musicians.musician_id INNER JOIN Albums ON Performances.albums_album_id = Albums.album_id;';

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.render('performances', { data: rows });
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };

// exports.insert = (req, res) => {
//     //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

//     let data = req.body;
//     let query1 = `INSERT INTO Performances (musicians_musician_id, albums_album_id) VALUES 
//     ((SELECT musician_id From Musicians WHERE first_name = '${data['input-perfMusFn']}' AND last_name = '${data['input-perfMusLn']}'), 
//     (SELECT album_id from Albums where name = '${data['input-perfAlbName']}'));`;

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/performances');
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
//     let dataId = req.query.perfeditId;
//     let dataMusId = req.query.perfmusceditId;
//     let dataMusFn = req.query.perfmusceditFn;
//     let dataMusLn = req.query.perfmusceditLn;
//     let dataPerfAlbId = req.query.perfalbid;
//     let dataPerfAlbName = req.query.perfalbname;

//     let perfId = parseInt(dataId)
//     if (isNaN(perfId)) {
//         perfId = 'NULL'
//     }

//     let query1 = `UPDATE Performances SET musicians_musician_id = (SELECT musician_id from Musicians where first_name = "${dataMusFn}" and last_name = "${dataMusLn}"), albums_album_id = (SELECT album_id from Albums where name = "${dataPerfAlbName}") WHERE performance_id = ${perfId}`;

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/performances');
//         }
//         else {
//             console.log(error.sql)
//             res.status(400).send({
//                 status: 400,
//                 error: error.sql
//             })
//         }
//     })
// };