const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Listeners;';
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