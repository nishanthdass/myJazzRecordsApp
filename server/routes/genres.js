const express = require('express');
const router = express.Router();
const genresctrl = require('../controllers/genresCtrl')

router.get('/genres', genresctrl.view);
router.post('/add-genre', genresctrl.insert);
router.put('/edit-genre', genresctrl.edit)
router.delete('/delgen', genresctrl.delete);

module.exports = router;









// const express = require('express');
// const router = express.Router();
// const genresctrl = require('../controllers/genresCtrl')
// // const listenersCtrl = require('../controllers/listenersCtrl')

// router.get('/genres', genresctrl.view);
// router.post('/genres', genresctrl.insert);
// router.get('/genres/editgen', genresctrl.edit);

// module.exports = router;