const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Performance_Ratings;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('perfratings', { data: rows });
            console.log(rows)
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};