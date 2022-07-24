const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('perfratings', { data: rows });
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

    let perfRating = parseInt(data['input-perfrateRating'])

    if (isNaN(perfRating)) {
        perfRating = 'NULL'
    }

    let query1 = `INSERT INTO Performance_Ratings (collections_collection_id, performances_albums_album_id, rating) VALUES ((SELECT collection_id From Collections WHERE name = "${data['input-perfrateColName']}"), (SELECT album_id from Albums where name = "${data['input-perfrateAlbName']}"), ${perfRating});`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/perfratings')
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
    let dataId = req.query.perfrateditId;
    let dataColId = req.query.perfrateditColId;
    let dataColName = req.query.perfrateditColName;
    let dataAlbId = req.query.perfrateditAlbId;
    let dataAlbName = req.query.perfrateditAlbName;
    let dataRating = req.query.perfratRating;

    let perfratId = parseInt(dataId)
    if (isNaN(perfratId)) {
        perfratId = 'NULL'
    }

    let perfrating = parseInt(dataRating)
    if (isNaN(perfrating)) {
        perfrating = 'NULL'
    }

    let query1 = `UPDATE Performance_Ratings SET collections_collection_id = (SELECT collection_id from Collections WHERE name = "${dataColName}"), performances_albums_album_id = (SELECT album_id from Albums where name = "${dataAlbName}"), rating = ${perfrating} WHERE performance_id = ${perfId}`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.redirect('/performances');
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