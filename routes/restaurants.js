const express = require('express');

const { protect, authorize } = require('../middleware/auth');

const restaurantController = require('../controllers/restaurants');

const router = express.Router();

const appointmentRouter = require('./appointments');

router.use('/:restaurantId/appointments', appointmentRouter);
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