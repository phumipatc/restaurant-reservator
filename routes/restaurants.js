const express = require('express');

const { protect, authorize } = require('../middleware/auth');

const restaurantController = require('../controllers/restaurants');

const router = express.Router();

const reservationRouter = require('./reservations');

router.use('/:restaurantId/reservations', reservationRouter);
router
	.route('/')
	.get(restaurantController.getRestaurants)
	.post(protect, authorize('admin'), restaurantController.createRestaurant);

router
	.route('/:id')
	.get(restaurantController.getRestaurant)
	.put(protect, authorize('admin'), restaurantController.updateRestaurant)
	.delete(protect, authorize('admin'), restaurantController.deleteRestaurant);

module.exports = router;