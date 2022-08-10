const express = require('express'); // require express
const router = express.Router();    // intitate express router
const listenersctrl = require('../controllers/listenersCtrl')   // require Controller file

// router for view
router.get('/listeners', listenersctrl.view);
// router for insert
router.post('/listeners/add-listener', listenersctrl.insert);
// router for update
router.put('/listeners/edit-listeners', listenersctrl.edit);
// router for delete
router.delete('/listeners/delete-listeners', listenersctrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;