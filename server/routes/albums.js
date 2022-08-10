const express = require('express'); // require express
const router = express.Router();    // intitate express router
const albumsCtrl = require('../controllers/albumsCtrl');    // require Controller file

// router for view
router.get('/albums', albumsCtrl.view);
// router for insert
router.post('/albums/add-album', albumsCtrl.insert);
// router for update
router.put('/albums/edit-album', albumsCtrl.edit);
// router for delete
router.delete('/albums/delete-album', albumsCtrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;