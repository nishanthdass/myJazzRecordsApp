const express = require('express'); // require express
const router = express.Router();    // intitate express router
const musiciansctrl = require('../controllers/musiciansCtrl');  // require Controller file

// router for view
router.get('/musicians', musiciansctrl.view);
// router for insert
router.post('/musicians/add-musician', musiciansctrl.insert);
// router for update
router.put('/musicians/edit-musician', musiciansctrl.edit);
// router for delete
router.delete('/musicians/delete-musician', musiciansctrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;