const express = require('express'); // require express
const router = express.Router();    // intitate express router
const perfratingctrl = require('../controllers/perfratingsCtrl');   // require Controller file

// router for view
router.get('/perfratings', perfratingctrl.view);
// router for insert
router.post('/perfratings/add-perfrating', perfratingctrl.insert);
// router for update
router.put('/perfratings/edit-perfrating', perfratingctrl.edit);
// router for delete
router.delete('/perfratings/delete-perfrating', perfratingctrl.delete);

// initiate export function from express Router. This allows Controller functions to export to router
module.exports = router;