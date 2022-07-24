const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandmember_id, Musicians.first_name, Musicians.last_name FROM Albums INNER JOIN Genres ON Albums.genres_genre_id = Genres.genre_id INNER JOIN Musicians ON Albums.bandmember_id = Musicians.musician_id;';
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
            console.log(error.sql)
            res.status(400).send({
                status: 400,
                error: error.sql
            })

        }
    })
};

exports.edit = (req, res) => {
    let dataId = req.query.albeditId;
    let dataName = req.query.albeditName;
    let dataRecyr = req.query.albeditRec;
    let dataRelyr = req.query.albeditRel;
    let dataGenrename = req.query.albeditgenre;
    let dataMusfn = req.query.albeditfn;
    let dataMusln = req.query.albeditln;

    // console.log(dataId, dataName, dataEmail)
    let albId = parseInt(dataId)
    if (isNaN(albId)) {
        albId = 'NULL'
    }

    let albRec = parseInt(dataRecyr)

    if (isNaN(albRec)) {
        albRec = 'NULL'
    }

    let albRel = parseInt(dataRelyr)

    if (isNaN(albRel)) {
        albRel = 'NULL'
    }

    let query1 = `UPDATE Albums SET name = "${dataName}", recording_year = ${albRec}, release_year = ${albRel}, bandmember_id = (SELECT musician_id from Musicians where first_name = '${dataMusfn}' and last_name = '${dataMusln}'), genres_genre_id = (SELECT genre_id from Genres WHERE name = '${dataGenrename}') WHERE album_id = ${albId}`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/albums');
        }
        else {
            console.log(error.sql)
            res.status(400).send({
                status: 400,
                error: error.sql
            })

        }
    })
};
