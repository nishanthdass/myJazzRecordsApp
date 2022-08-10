const express = require('express');
const router = express.Router();
const genresctrl = require('../controllers/genresCtrl')

router.get('/genres', genresctrl.view);
router.post('/add-genre', genresctrl.insert);
router.put('/edit-genre', genresctrl.edit)
router.delete('/delgen', genresctrl.delete);

module.exports = router;