// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    let query1;
    // if search field in Collections is empty, then send all rows
    if (req.query.searchName === undefined) {
        query1 = `Select * from Collections;`;
    }
    else {
        // if search field in Collections has a string, then use below query
        query1 = `SELECT * FROM Collections WHERE name LIKE "%${req.query.searchName}%"`
    }
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            // if no errors export a render of home page along with object containing row data
            res.render('home', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};


//  view a particular rows information by making request and response from db for a joined table which will allow our app to sum ratings or musicians associated with a particular collection
exports.viewCol = (req, res) => {
    // request contatins the row id associated with the data of a particular row
    let data = req.body
    let collectionId = parseInt(data.id);

    let query1 = `SELECT Listeners.name AS ListName, Albums.name, Albums.album_id , Performance_Ratings.performances_albums_album_id, SUM(Performance_Ratings.rating) AS rating, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name
    FROM Listeners 
        INNER JOIN Performance_Ratings 
            ON Listeners.collections_collection_id = Performance_Ratings.collections_collection_id
        INNER JOIN Albums
            ON Performance_Ratings.Performances_albums_album_id = Albums.album_id
        INNER JOIN Performances
            ON Albums.album_id = Performances.albums_album_id
        INNER Join Musicians
            ON Performances.musicians_musician_id = Musicians.musician_id
    WHERE Listeners.name = (SELECT name FROM Listeners WHERE collections_collection_id = ${collectionId})
    GROUP BY Musicians.musician_id
    ORDER BY rating DESC;`;

    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            // if no error export rows
            res.send(rows)
        }
        else {
            console.log('database error: \n', console.log(error))
        }
    })
};

// insert data into database
exports.insert = function (req, res) {
    // request contains data input into the forms field
    let data = req.body;

    query1 = `INSERT INTO Collections (name) VALUES ("${data.name}")`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // if insertion is successful send the all rows back so that we can render new row in table
            query2 = `SELECT * FROM Collections;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
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
    let collectionId = parseInt(data.collectionId);

    query1 = `UPDATE Collections SET name = ? WHERE collection_id = ?`;
    query2 = `SELECT * FROM Collections;`

    db.pool.query(query1, [data.collectionName, collectionId], function (error, rows, fields) {
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
    let collectionID = parseInt(data.id);

    let query1 = `DELETE FROM Collections WHERE collection_id = ?`;

    db.pool.query(query1, [collectionID], function (error, rows, fields) {
        if (error) {
            res.status(400).send(error)
        } else {
            res.sendStatus(204)
        }
    })
};

