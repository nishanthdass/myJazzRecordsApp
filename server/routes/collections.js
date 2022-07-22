const express = require('express');
const router = express.Router();
const collectionsctrl = require('../controllers/collectionsCtrl')
// const listenersctrl = require('../controllers/listenersCtrl')

router.get('/', collectionsctrl.view);
router.post('/', collectionsctrl.insert);
// router.get('/:id', collectionsctrl.edit);


module.exports = router;