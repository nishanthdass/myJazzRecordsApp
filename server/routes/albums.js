const express = require('express');
const router = express.Router();
const albumsCtrl = require('../controllers/albumsCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/albums', albumsCtrl.view);
router.post('/albums/add-album', albumsCtrl.insert);
router.get('/albums/editalb', albumsCtrl.edit);

module.exports = router;