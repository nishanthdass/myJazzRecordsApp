const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Musicians;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('musicians', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;
    let query1 = `INSERT INTO Musicians (first_name, last_name, instrument) VALUES ('${data['input-musFn']}', '${data['input-musLn']}', '${data['input-musInst']}');`

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/musicians');
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