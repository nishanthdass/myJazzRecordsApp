const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    // let query1 = 'Select * from Performances;';

    let query1 = 'SELECT Performances.performance_id, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name, Performances.albums_album_id, Albums.name From Performances INNER JOIN Musicians ON Performances.musicians_musician_id = Musicians.musician_id INNER JOIN Albums ON Performances.albums_album_id = Albums.album_id;';


    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('performances', { data: rows });
            console.log(rows)
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;
    let query1 = `INSERT INTO Performances (musicians_musician_id, albums_album_id) VALUES 
    ((SELECT musician_id From Musicians WHERE first_name = '${data['input-perfMusFn']}' AND last_name = '${data['input-perfMusLn']}'), 
    (SELECT album_id from Albums where name = '${data['input-perfAlbName']}'));`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/performances');
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