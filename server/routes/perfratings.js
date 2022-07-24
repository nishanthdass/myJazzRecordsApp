const express = require('express');
const router = express.Router();
const perfratingctrl = require('../controllers/perfratingsCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/perfratings', perfratingctrl.view);
router.post('/perfratings', perfratingctrl.insert);
router.get('/perfratings/editperfrat', perfratingctrl.edit);

module.exports = router;