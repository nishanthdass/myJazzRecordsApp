const express = require('express');
const router = express.Router();
const musiciansctrl = require('../controllers/musiciansCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/musicians', musiciansctrl.view);
router.post('/musicians', musiciansctrl.insert);
router.get('/musicians/editmusc', musiciansctrl.edit);


module.exports = router;