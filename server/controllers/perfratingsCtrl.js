const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id ORDER BY Performance_Ratings.performance_rating_id;';
    let query2 = 'SELECT * FROM Collections;'
    let query3 = 'SELECT Albums.album_id as albId, Albums.name as albName FROM Albums INNER JOIN Performances ON Albums.album_id = Performances.albums_album_id GROUP BY Albums.album_id;'
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {

            db.pool.query(query2, function (error, rowCols, fields) {
                if (!error) {

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

exports.insert = (req, res) => {
    //https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

    let data = req.body;

    console.log(data)

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
            db.pool.query(query2, function (error, rowsPerfRate, fields) {
                if (!error) {
                    res.send(rowsPerfRate);
                }
                else {
                    console.log('database error: \n', console.log(error));
                    res.status(400).send({
                        status: 400,
                        error: 'Not found'
                    })
                }
            })
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


exports.edit = (req, res) => {
    console.log(req.body)
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