const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Genres;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('genres', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;
    let query1 = `INSERT INTO Genres (name) VALUES ('${data['input-genName']}');`

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/genres');
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
