const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');

//Comments Routes - simplified for now

router.get('/', mapController.getMap);
router.get('/coordinates/:latitude/:longitude', mapController.getCoordinates)
router.get('/coordinates/:latitude/:longitude/:radius', mapController.getCoordinatesRadius)
router.get('/geocode/:address', mapController.geocode);
router.get('/getmapjs', mapController.getmapjs);

module.exports = router;



