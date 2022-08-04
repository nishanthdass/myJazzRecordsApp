const mysql = require('mysql');
const db = require('../../database/db-connector')


exports.view = (req, res) => {
    let query1 = 'SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;';
    let query2 = `SELECT * FROM Collections;`;
    db.pool.query(query1, function (error, rows, fields) {
        if (!error) {

            db.pool.query(query2, function (error, rowCols, fields) {
                if (!error) {

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



exports.insert = function (req, res) {
    let data = req.body;

    let colId = parseInt(data.colName)

    if (isNaN(colId)) {
        colId = 'NULL'
    }

    isChecked = data.colCheck



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
                        // console.log(rows)
                        res.send(rows);
                    }
                })
            }
        })
    } else {
        let insCol = `INSERT INTO Collections (name) VALUES ("${data.name}'s Collection");`;
        let selAllCol = `SElECT * FROM Collections;`
        let selCol = `(SELECT collection_id FROM Collections WHERE collection_id = (SELECT last_insert_id()));`;
        let insertList = `INSERT INTO Listeners (name, email, collections_collection_id) VALUES ("${data.name}", "${data.email}", (SELECT collection_id FROM Collections WHERE collection_id = (SELECT last_insert_id())));`;
        let showList = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;
        console.log(insCol)
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
                        // console.log(collections)
                        // res.render({ collections: collections });
                        // res.render('listeners', { collections: collections });
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
                                        // console.log(listRows)
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




exports.edit = function (req, res, next) {
    let data = req.body;
    console.log(data)

    let listenerId = parseInt(data.listenerId);
    let listenerColSelect = parseInt(data.listenerColIdSelect);
    console.log(listenerColSelect)


    query1 = `UPDATE Listeners SET name = "${data.listenerName}", email = "${data.listenerEmail}", collections_collection_id = ${listenerColSelect} WHERE listeners_id = ${listenerId}`;
    query2 = `SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;`;

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
                    res.send(rows);
                }
            })
        }
    })
};






exports.delete = function (req, res, next) {
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

