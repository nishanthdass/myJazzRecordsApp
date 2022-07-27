const express = require('express');
const router = express.Router();
const collectionsctrl = require('../controllers/collectionsCtrl')
// const listenersctrl = require('../controllers/listenersCtrl')

router.get('/', collectionsctrl.view);
router.post('/add-collection', collectionsctrl.insert);
// router.get('/editcol', collectionsctrl.edit);
router.put('/edit-collection', collectionsctrl.edit)
router.delete('/delcol', collectionsctrl.delete);

module.exports = router;