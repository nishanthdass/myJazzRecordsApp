const express = require('express');
const router = express.Router();
const performancesctrl = require('../controllers/performancesCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/performances', performancesctrl.view);
router.post('/performances', performancesctrl.insert);
router.get('/performances/editperf', performancesctrl.edit);

module.exports = router;