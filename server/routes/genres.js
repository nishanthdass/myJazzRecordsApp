const express = require('express');
const router = express.Router();
const genresctrl = require('../controllers/genresCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/genres', genresctrl.view);
router.post('/genres', genresctrl.insert);

module.exports = router;