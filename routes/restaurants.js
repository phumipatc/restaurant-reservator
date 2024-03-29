const express = require('express');

const restaurantController = require('../controllers/restaurants');

const router = express.Router();

router
	.route('/')
	.get(restaurantController.getRestaurants)
	.post(restaurantController.createRestaurant);

router
	.route('/:id')
	.get(restaurantController.getRestaurant)
	.put(restaurantController.updateRestaurant)
	.delete(restaurantController.deleteRestaurant);

module.exports = router;