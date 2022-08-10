// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    let query1 = 'Select * from Musicians ORDER BY musician_id;';
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            res.render('musicians', { data: rows });
        }
        else {
            console.log('database error: \n', console.log(err))
        }
    })
};

// insert data into database
exports.insert = function (req, res) {
    // request contains data input into the forms field
    let data = req.body;

    let query1 = `INSERT INTO Musicians (first_name, last_name, instrument) VALUES ("${data.first_name}", "${data.last_name}", "${data.instrument}");`


    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // if insertion is successful send the all rows back so that we can render new row in table
            query2 = `SELECT * FROM Musicians ORDER BY musician_id;`;
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
    let musicianId = parseInt(data.musician_id);

    query1 = `UPDATE Musicians SET first_name = ?, last_name = ?, instrument = ? WHERE musician_id = ?`;
    query2 = `SELECT * FROM Musicians ORDER BY musician_id;`

    db.pool.query(query1, [data.first_name, data.last_name, data.instrument, musicianId], function (error, rows, fields) {
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
    let musicianId = parseInt(data.id);

    let query1 = `DELETE FROM Musicians WHERE musician_id = ?`;

    db.pool.query(query1, [musicianId], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};