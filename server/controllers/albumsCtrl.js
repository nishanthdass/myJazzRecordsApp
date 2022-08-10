// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    // first query is made to provide the Albums page view with a joined table so that we cam view the associated genre and bandleader(from musicians)
    let query1 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';
    // query 2 & 3 will help populate selectpicker
    let query2 = 'Select * from Musicians';
    let query3 = 'Select * from Genres';
    db.pool.query(query1, function (error, rows, fields) {
        let albums = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let musicians = rows;
            db.pool.query(query3, (error, rows, fields) => {
                // if no errors export a render of Albums page along with object containing row data and genres & musicians selectpicker data
                let genres = rows;
                res.render('albums', { data: albums, musicians: musicians, genres: genres });
            })
        })
    })
};


// insert data into database
exports.insert = function (req, res) {
    // request contains data input into the forms field
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
    // query 1 deals specifically with insertion into Albums. Data is received from the request which gathers data from forms.
    let query1 = `INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandleader_id) 
        VALUES ("${data.name}", ${albRec}, ${albRel}, ${albGen}, 
        ${albBl});`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // query 2 is grabs data so that we can render newly added row
            let query2 = `SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;`;
            db.pool.query(query2, function (error, rows, fields) {
                
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // query 3 is triggered if the forms section of html contained a data value for performances(id="input-associated")
                    // query 3 allows user to form the many to many relationship between albums and musicians by inserting into Performances.
                    if (data.perfMusicians === null) {
                    }
                    else {
                        let perfMusi = data.perfMusicians
                        let perfMusiString = ""

                        // loop is written with the purpose of concatenating a string that contains every musicians that is to be associated with the most recently created album 
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


// Update a row in database
exports.edit = function (req, res, next) {
    // request includes row id for the row that is being updated
    let data = req.body;

    let albumId = parseInt(data.albumId);
    let albumRec = parseInt(data.albumRec);
    let albumRel = parseInt(data.albumRel);

    let query1 = `UPDATE Albums SET name = "${data.albumName}", recording_year = "${albumRec}", release_year = "${albumRel}", genres_genre_id = (SELECT genre_id from Genres WHERE name = "${data.albumGen}"), bandleader_id = (SELECT musician_id From Musicians WHERE first_name = "${data.albumBlFn}" AND last_name = "${data.albumBlLn}" )  WHERE album_id = "${albumId}"`;
    let query2 = 'SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // if update to db is successful send back all rows so that the appropriate row can be indexed and rendered with updated information
            db.pool.query(query2, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
};


// Delete a row in the db
exports.delete = function (req, res, next) {
    // request will include the row id for row to be deleted
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

