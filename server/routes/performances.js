const express = require('express'); // require express
const router = express.Router();    // intitate express router
const performancesctrl = require('../controllers/performancesCtrl');    // require Controller file

// router for view
router.get('/performances', performancesctrl.view);
// router for insert
router.post('/performances/add-performance', performancesctrl.insert);
// router for update
router.get('/performances/editperf', performancesctrl.edit);
// router for delete
router.delete('/performances/delete-performance', performancesctrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;