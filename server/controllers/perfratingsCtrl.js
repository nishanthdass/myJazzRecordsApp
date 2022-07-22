const mysql = require('mysql');
// const { query } = require('express');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id;';

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('perfratings', { data: rows });
            console.log(rows)
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};