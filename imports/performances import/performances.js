const express = require('express');
const router = express.Router();
const performancesctrl = require('../controllers/performancesCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/performances', performancesctrl.view);
router.post('/performances/add-performance', performancesctrl.insert);
router.get('/performances/editperf', performancesctrl.edit);
router.delete('/performances/delete-performance', performancesctrl.delete);


module.exports = router;