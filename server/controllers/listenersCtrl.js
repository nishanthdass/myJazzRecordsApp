const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners INNER JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('listeners', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

// exports.insert = (req, res) => {
//     //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

//     let data = req.body;

//     let query1 = `INSERT INTO Listeners (name, email, collections_collection_id) 
//     VALUES ('${data['input-listName']}', '${data['input-listEmail']}', (SELECT collection_id From Collections WHERE name = '${data['input-listColName']}'));`;

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/listeners');
//         }
//         else {
//             console.log('database error: \n', console.log(error));
//             res.sendStatus(400);
//         }
//     })
// };


exports.insert = function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1 = `INSERT INTO Listeners (name, email, collections_collection_id) 
    VALUES ("${data.name}", "${data.email}", (SELECT collection_id From Collections WHERE name = "${data.colName}"));`;


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
            query2 = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners INNER JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;
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
//     let dataId = req.query.listeditId;
//     let dataName = req.query.listeditName;
//     let dataEmail = req.query.listediEmail;

//     // console.log(dataId, dataName, dataEmail)
//     let listId = parseInt(dataId)

//     if (isNaN(listId)) {
//         listId = 'NULL'
//     }

//     let query1 = `UPDATE Listeners SET name = '${dataName}', email = '${dataEmail}' WHERE listeners_id = ${listId}`;
//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/listeners');
//         }
//         else {
//             console.log('database error: \n', console.log(error))
//         }
//     })
// };



exports.edit = function (req, res, next) {
    let data = req.body;

    console.log(data)
    let listenerId = parseInt(data.listenerId);
    // let listenerName = parseInt(data.listenerName);
    // let listenerEmail = parseInt(data.listenerEmail);
    // let listenerColName = parseInt(data.listenerColName);
    // console.log(listenerId, listenerName, listenerEmail, listenerColName)


    // let query1 = `UPDATE Listeners SET name = '${dataName}', email = '${dataEmail}' WHERE listeners_id = ${listId}`;

    query1 = `UPDATE Listeners SET name = ?, email = ? WHERE listeners_id = ?`;
    query2 = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners INNER JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;

    // Run the 1st query
    db.pool.query(query1, [data.listenerName, data.listenerEmail, listenerId], function (error, rows, fields) {
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
    // console.log("works!!!")
    let data = req.body;
    let listenerID = parseInt(data.id);
    console.log(listenerID)

    let query1 = `DELETE FROM Listeners WHERE listeners_id = ?`;


    // Run the 1st query
    db.pool.query(query1, [listenerID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};

