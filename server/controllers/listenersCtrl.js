// Citation for the following function: view, insert, edit, delete
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

const mysql = require('mysql');     // require mysql
const db = require('../../database/db-connector')   // require database connection information to make queries to db

//  view request and response from db
exports.view = (req, res) => {
    // first query is made to provide the Listener page view with a joined table so that we cam view the associated collection
    let query1 = 'SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;';
    // second query allows us to populate selectpicker menu
    let query2 = `SELECT * FROM Collections;`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {
            db.pool.query(query2, function (error, rowCols, fields) {
                if (!error) {
                    // if no errors export a render of listeners page along with object containing row data and collections selectpicker data
                    let collections = rowCols
                    res.render('listeners', { data: rows, collections: collections });
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
exports.insert = function (req, res) {
    // request contains data input into the forms field
    let data = req.body;
    let colId = parseInt(data.colName)

    if (isNaN(colId)) {
        colId = 'NULL'
    }
    // isChecked variable will check if checkmark to create a generic collection is clicked
    let isChecked = data.colCheck

    // if not isChecked, then use the collection id from selectpicker in UI to insert in listener
    if (!isChecked) {
        let query1 = `INSERT INTO Listeners (name, email, collections_collection_id) 
        VALUES ("${data.name}", "${data.email}", ${colId});`;

        db.pool.query(query1, function (error, rows, fields) {
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else {
                let query2 = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;
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
    } 
    // if isChecked then first insert into collections a generic associated collection name for listener
    // Then for query2 use Select * from Collections so that we can use SELECT last_insert_id())) in query 3
    // query3 will handle the insert of the newly created collection and it will input the latest created collection id as a FK
    // finally all rows are sent back so that new data can be rendered.
    else {
        let insCol = `INSERT INTO Collections (name) VALUES ("${data.name}'s Collection");`;
        let selAllCol = `SElECT * FROM Collections;`
        let insertList = `INSERT INTO Listeners (name, email, collections_collection_id) VALUES ("${data.name}", "${data.email}", (SELECT collection_id FROM Collections WHERE collection_id = (SELECT last_insert_id())));`;
        let showList = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;
        db.pool.query(insCol, function (error, rows, fields) {
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else {
                db.pool.query(selAllCol, function (error, colRow, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else {
                        let collections = colRow
                        db.pool.query(insertList, function (error, keyCol, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            }
                            else {
                                db.pool.query(showList, function (error, listRows, fields) {
                                    if (error) {
                                        console.log(error);
                                        res.sendStatus(400);
                                    }
                                    else {
                                        res.send(listRows)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
};

// Update a row in database
exports.edit = function (req, res, next) {
    // request includes row id for the row that is being updated
    let data = req.body;

    let listenerId = parseInt(data.listenerId);
    let listenerColSelect = parseInt(data.listenerColIdSelect);

    query1 = `UPDATE Listeners SET name = "${data.listenerName}", email = "${data.listenerEmail}", collections_collection_id = ${listenerColSelect} WHERE listeners_id = ${listenerId}`;
    query2 = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;

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
    let listenerID = parseInt(data.id);

    let query1 = `DELETE FROM Listeners WHERE listeners_id = ?`;

    db.pool.query(query1, [listenerID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
};

