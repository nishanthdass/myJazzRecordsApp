const express = require('express'); // require express
const router = express.Router();    // intitate express router
const collectionsctrl = require('../controllers/collectionsCtrl'); // require Controller file

// router for view
router.get('/', collectionsctrl.view);
// router for viewbutton which upon click makes a Select query and populates modal in UI
router.post('/view-collection', collectionsctrl.viewCol);
// router for insert
router.post('/add-collection', collectionsctrl.insert);
// router for update
router.put('/edit-collection', collectionsctrl.edit)
// router for delete
router.delete('/delcol', collectionsctrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;