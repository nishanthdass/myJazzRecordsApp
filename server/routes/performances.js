const express = require('express');
const router = express.Router();
const performancesctrl = require('../controllers/performancesCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/performances', performancesctrl.view);


module.exports = router;