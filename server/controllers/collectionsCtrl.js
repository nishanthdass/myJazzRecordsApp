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

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;
    let query1 = `INSERT INTO Collections (name) VALUES ('${data['input-colName']}');`

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/');
        }
        else {
            console.log('database error: \n', console.log(error));

            res.status(400).send({
                status: 400,
                error: 'Not found'
            })

        }
    })
};

exports.edit = (req, res) => {
    let dataId = req.query.coleditId;
    let dataName = req.query.coleditName;

    let colId = parseInt(dataId)

    if (isNaN(colId)) {
        colId = 'NULL'
    }

    let query1 = `UPDATE Collections SET name = "${dataName}" WHERE collection_id = ${colId}`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/');
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};
