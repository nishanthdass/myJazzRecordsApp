const express = require('express');
const router = express.Router();
const listenersctrl = require('../controllers/listenersCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/listeners', listenersctrl.view);
router.post('/listeners', listenersctrl.insert);


module.exports = router;