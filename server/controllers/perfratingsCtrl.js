// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    // first query is made to provide the Performance Rating page view with a joined table so that we cam view the associated collection 
    let query1 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id ORDER BY Performance_Ratings.performance_rating_id;';
    // second query allows us to populate selectpicker menu with collection data
    let query2 = 'SELECT * FROM Collections;'
    // third query uses a inner join to populate selectpicker with Albums that have musicians associated with it. Albums with no musicians will not be an option in selectpicker.
    let query3 = 'SELECT Albums.album_id as albId, Albums.name as albName FROM Albums INNER JOIN Performances ON Albums.album_id = Performances.albums_album_id GROUP BY Albums.album_id;'
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            db.pool.query(query2, function (error, rowCols, fields) {
                if (!error) {
                    // if no errors export a render of perfratings page along with object containing row data and collections & albums selectpicker data
                    let collections = rowCols
                    db.pool.query(query3, function (error, rowCols, fields) {
                        if (!error) {
                            let albums = rowCols
                            console.log(albums)
                            res.render('perfratings', { data: rows, collections: collections, albums: albums });
                        }
                        else {
                            console.log('database error: \n', console.log(error))
                        }
                    })
                }
                else {
                    console.log('database error: \n', console.log(error))
                }
            })
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

// insert data into database
exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    // request contains data input into the forms field
    let data = req.body;

    let perfRating = parseInt(data.rating)
    if (isNaN(perfRating)) {
        perfRating = 'NULL'
    }

    let albumId = parseInt(data.albName)
    if (isNaN(albumId)) {
        albumId = 'NULL'
    }

    let colId = parseInt(data.colName)
    if (isNaN(colId)) {
        colId = 'NULL'
    }

    let query1 = `INSERT INTO Performance_Ratings (collections_collection_id, performances_albums_album_id, rating) VALUES (${colId}, ${albumId}, ${perfRating});`;
    let query2 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id  ORDER BY Performance_Ratings.performance_rating_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            // if insertion is successful send the all rows back so that we can render new row in table
            db.pool.query(query2, function (error, rowsPerfRate, fields) {
                if (!error) {
                    res.send(rowsPerfRate);
                }
                else {
                    console.log('database error: \n', console.log(error));
                    res.status(400).send(error)
                }
            })
        }
        else {
            console.log('database error: \n', console.log(error));
            res.status(400).send(error)
        }
    })
};


// Update a row in database
exports.edit = (req, res) => {
    // request includes row id for the row that is being updated
    data = req.body

    let perfratId = parseInt(data.perfRateId)
    if (isNaN(perfratId)) {
        perfratId = 'NULL'
    }

    let perfratColId = parseInt(data.colId)
    if (isNaN(perfratColId)) {
        perfratColId = 'NULL'
    }

    let perfratAlbId = parseInt(data.albId)
    if (isNaN(perfratAlbId)) {
        perfratAlbId = 'NULL'
    }

    let perfrating = parseInt(data.rating)
    if (isNaN(perfrating)) {
        perfrating = 'NULL'
    }

    let query1 = `UPDATE Performance_Ratings SET collections_collection_id = (SELECT collection_id from Collections WHERE name = "${data.colName}"), performances_albums_album_id = (SELECT album_id from Albums where name = "${data.albName}"), rating = ${perfrating} WHERE performance_rating_id = ${perfratId}`;
    let query2 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id  ORDER BY Performance_Ratings.performance_rating_id;';

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
    let perfratingId = parseInt(data.id);

    let query1 = `DELETE FROM Performance_Ratings WHERE performance_rating_id = ?`;

    db.pool.query(query1, [perfratingId], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};