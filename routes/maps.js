const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');

//Comments Routes - simplified for now

router.get('/', mapController.getMap);
router.get('/coordinates/:latitude/:longitude', mapController.getCoordinates)
router.get('/coordinates/:latitude/:longitude/:radius', mapController.getCoordinatesRadius)

module.exports = router;
