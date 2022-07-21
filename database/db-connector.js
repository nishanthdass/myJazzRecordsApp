// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_dassn',
    password: '3369',
    database: 'cs340_dassn'
})

// Export it for use in our application
module.exports.pool = pool;