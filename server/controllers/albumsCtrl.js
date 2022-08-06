const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')



exports.view = (req, res) => {
    let query1 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';
    let query2 = 'Select * from Musicians';
    let query3 = 'Select * from Genres';
    db.pool.query(query1, function (error, rows, fields) {

        let albums = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let musicians = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let genres = rows;

                res.render('albums', { data: albums, musicians: musicians, genres: genres });

            })

        })
    })
};



exports.insert = function (req, res) {
    let data = req.body;

    let albRec = parseInt(data.recYr)

    if (isNaN(albRec)) {
        albRec = 'NULL'
    }

    let albRel = parseInt(data.relYr)

    if (isNaN(albRel)) {
        albRel = 'NULL'
    }

    let albBl = parseInt(data.bandleader)

    if (isNaN(albBl)) {
        albBl = 'NULL'
    }

    let albGen = parseInt(data.genre)

    if (isNaN(albGen)) {
        albGen = 'NULL'
    }

    let query1 = `INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandleader_id) 
        VALUES ("${data.name}", ${albRec}, ${albRel}, ${albGen}, 
        ${albBl});`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            let query2 = `SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    if (data.perfMusicians === null) {
                        console.log("yes, its null")
                    }
                    else {
                        let perfMusi = data.perfMusicians
                        let perfMusiString = ""

                        for (const musi of perfMusi) {
                            perfMusiString += "(" + musi + ", (SELECT album_id FROM Albums WHERE album_id = (select last_insert_id()))), "
                        }
                        let queryString = perfMusiString.slice(0, -2)

                        let query3 = `INSERT INTO Performances (musicians_musician_id, albums_album_id) VALUES ${queryString};`

                        db.pool.query(query3, function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            }
                        })

                    }
                    res.send(rows);
                }
            })
        }
    })
};



exports.edit = function (req, res, next) {
    let data = req.body;

    let albumId = parseInt(data.albumId);
    let albumRec = parseInt(data.albumRec);
    let albumRel = parseInt(data.albumRel);

    let query1 = `UPDATE Albums SET name = "${data.albumName}", recording_year = "${albumRec}", release_year = "${albumRel}", genres_genre_id = (SELECT genre_id from Genres WHERE name = "${data.albumGen}"), bandleader_id = (SELECT musician_id From Musicians WHERE first_name = "${data.albumBlFn}" AND last_name = "${data.albumBlLn}" )  WHERE album_id = "${albumId}"`;

    let query2 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';
    db.pool.query(query1, function (error, rows, fields) {
        console.log(data.albumName, albumRec, albumRel, data.albumGen, data.albumBlFn, data.albumBlLn, albumId)
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(query2, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // console.log(rows)
                    res.send(rows);
                }
            })
        }
    })
};




exports.delete = function (req, res, next) {
    let data = req.body;
    let albumId = parseInt(data.id);

    let query1 = `DELETE FROM Albums WHERE album_id = ?`;

    db.pool.query(query1, [albumId], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};

