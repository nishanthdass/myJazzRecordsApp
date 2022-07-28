const express = require('express');
const router = express.Router();
const musiciansctrl = require('../controllers/musiciansCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/musicians', musiciansctrl.view);
router.post('/musicians/add-musician', musiciansctrl.insert);
router.put('/musicians/edit-musician', musiciansctrl.edit);
router.delete('/musicians/delete-musician', musiciansctrl.delete);


module.exports = router;