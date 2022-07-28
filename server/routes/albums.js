const express = require('express');
const router = express.Router();
const albumsCtrl = require('../controllers/albumsCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/albums', albumsCtrl.view);
router.post('/albums/add-album', albumsCtrl.insert);
router.put('/albums/edit-album', albumsCtrl.edit);
router.delete('/albums/delete-album', albumsCtrl.delete);

module.exports = router;