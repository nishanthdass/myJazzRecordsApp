const express = require('express');
const router = express.Router();
const albumsCtrl = require('../controllers/albumsCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/albums', albumsCtrl.view);


module.exports = router;