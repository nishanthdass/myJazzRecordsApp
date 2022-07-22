const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'Select * from Albums;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('albums', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;

    let albRec = parseInt(data['input-albRec'])

    if (isNaN(albRec)) {
        albRec = 'NULL'
    }

    let albRel = parseInt(data['input-albRel'])

    if (isNaN(albRel)) {
        albRel = 'NULL'
    }

    let query1 = `INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandmember_id) 
    VALUES ('${data['input-albName']}', ${albRec}, '${albRel}', (SELECT genre_id from Genres WHERE name = '${data['input-albGen']}'), 
    (SELECT musician_id From Musicians WHERE first_name = '${data['input-albBlFn']}' AND last_name = '${data['input-albBlLn']}'));`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/albums');
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