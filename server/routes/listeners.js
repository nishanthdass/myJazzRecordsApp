const express = require('express');
const router = express.Router();
const listenersctrl = require('../controllers/listenersCtrl')
// const listenersCtrl = require('../controllers/listenersCtrl')

router.get('/listeners', listenersctrl.view);
router.post('/listeners/add-listener', listenersctrl.insert);
router.put('/listeners/edit-listeners', listenersctrl.edit);
router.delete('/listeners/delete-listeners', listenersctrl.delete);


module.exports = router;