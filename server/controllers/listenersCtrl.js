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
            console.log('database error: \n', console.log(err))
        }
    })
};

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;

    // let selquery = `SELECT collection_id From Collections WHERE name = '${data['input-listName']}'`
    // console.log(selquery)

    // let colId = parseInt(data['input-listColName'])

    // if (isNaN(colId)) {
    //     colId = 'NULL'
    // }

    let query1 = `INSERT INTO Listeners (name, email, collections_collection_id) 
    VALUES ('${data['input-listName']}', '${data['input-listEmail']}', (SELECT collection_id From Collections WHERE name = '${data['input-listColName']}'));`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/listeners');
        }
        else {
            console.log('database error: \n', console.log(error));
            res.sendStatus(400);
        }
    })
};

exports.edit = (req, res) => {
    let dataId = req.query.listeditId;
    let dataName = req.query.listeditName;
    let dataEmail = req.query.listediEmail;

    // console.log(dataId, dataName, dataEmail)
    let listId = parseInt(dataId)

    if (isNaN(listId)) {
        listId = 'NULL'
    }

    let query1 = `UPDATE Listeners SET name = '${dataName}', email = '${dataEmail}' WHERE listeners_id = ${listId}`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/listeners');
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};
