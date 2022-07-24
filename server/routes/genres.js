const express = require('express');
const router = express.Router();
const genresctrl = require('../controllers/genresCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/genres', genresctrl.view);
router.post('/genres', genresctrl.insert);
router.get('/genres/editgen', genresctrl.edit);

module.exports = router;