const express = require('express');   // We are using the express library for the web server
const expHandBar = require('express-handlebars');
const bodyparser = require('body-parser');
const db = require('./database/db-connector')
const app = express();            // We need to instantiate an express object to interact with the server in our code
PORT = 51214;                 // Set a port number at the top so it's easy to change in the future

// Handlebars init
// https://stackoverflow.com/questions/69959820/typeerror-exphbs-is-not-a-function
app.engine('.hbs', expHandBar.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

require('dotenv').config()

// Body-parser middleware
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(bodyparser.json());

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// access static files
app.use(express.static('public'));


// Handlebars Helpers 
// https://stackoverflow.com/questions/41764373/how-to-register-custom-handlebars-helpers
const hbs = expHandBar.create({});

// https://stackoverflow.com/questions/48270865/render-with-handlebars-a-html-select-element-with-option-selected
hbs.handlebars.registerHelper('isSelected', function (value, key) {
    return value === key ? 'selected' : '';
});



// Routes Below
const collectionroutes = require('./server/routes/collections');
app.use('/', collectionroutes);

const listenerroutes = require('./server/routes/listeners');
app.use('/', listenerroutes);

const albumroutes = require('./server/routes/albums');
app.use('/', albumroutes);

const musicianroutes = require('./server/routes/musicians');
app.use('/', musicianroutes);

const genreroutes = require('./server/routes/genres');
app.use('/', genreroutes);

const performanceroutes = require('./server/routes/performances');
app.use('/', performanceroutes);

const perfratingroutes = require('./server/routes/perfratings');
app.use('/', perfratingroutes);


app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + ';')
});