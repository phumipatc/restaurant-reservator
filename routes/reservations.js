const express = require('express');
const { getReservations, getReservation, createReservation, updateReservation, deleteReservation } = require('../controllers/reservations');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
router.route("/")
    .get(protect, getReservations)
    .post(protect, authorize('admin', 'user'), createReservation);
router.route("/:id")
    .get(protect, getReservation)
    .put(protect, authorize('admin', 'user'), updateReservation)
    .delete(protect, authorize('admin', 'user'), deleteReservation);
router.route("/:id/rating")
    .put(protect, authorize('admin', 'user'), updateReservation);
module.exports = router;