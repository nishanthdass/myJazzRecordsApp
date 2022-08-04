const express = require('express');
const router = express.Router();
const perfratingctrl = require('../controllers/perfratingsCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/perfratings', perfratingctrl.view);
// router.post('/perfratings', perfratingctrl.insert);
// router.get('/perfratings/editperfrat', perfratingctrl.edit);

router.post('/perfratings/add-perfrating', perfratingctrl.insert);
router.put('/perfratings/edit-perfrating', perfratingctrl.edit);
router.delete('/perfratings/delete-perfrating', perfratingctrl.delete);


module.exports = router;