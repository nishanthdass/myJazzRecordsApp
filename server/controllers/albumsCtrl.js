const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums INNER JOIN Genres ON Albums.genres_genre_id = Genres.genre_id INNER JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('albums', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

// exports.insert = (req, res) => {
//     //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

//     let data = req.body;

//     let albRec = parseInt(data['input-albRec'])

//     if (isNaN(albRec)) {
//         albRec = 'NULL'
//     }

//     let albRel = parseInt(data['input-albRel'])

//     if (isNaN(albRel)) {
//         albRel = 'NULL'
//     }

//     let query1 = `INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandmember_id) 
//     VALUES ('${data['input-albName']}', ${albRec}, '${albRel}', (SELECT genre_id from Genres WHERE name = '${data['input-albGen']}'), 
//     (SELECT musician_id From Musicians WHERE first_name = '${data['input-albBlFn']}' AND last_name = '${data['input-albBlLn']}'));`;

//     db.pool.query(query1, function (error, rows, fields) {
//         if (!error) {
//             res.redirect('/albums');
//         }
//         else {
//             console.log(error.sql)
//             res.status(400).send({
//                 status: 400,
//                 error: error.sql
//             })

//         }
//     })
// };


exports.insert = function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log(data)

    let albRec = parseInt(data.recYr)

    if (isNaN(albRec)) {
        albRec = 'NULL'
    }

    let albRel = parseInt(data.relYr)

    if (isNaN(albRel)) {
        albRel = 'NULL'
    }

    let query1 = `INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandleader_id) 
        VALUES ("${data.name}", ${albRec}, ${albRel}, (SELECT genre_id from Genres WHERE name = "${data.genre}"), 
        (SELECT musician_id From Musicians WHERE first_name = "${data.bandFn}" AND last_name = "${data.bandLn}"));`;


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
            let query2 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums INNER JOIN Genres ON Albums.genres_genre_id = Genres.genre_id INNER JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';
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


