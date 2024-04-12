const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

//@desc		Get all reservations
//@route	GET /api/v1/reservations
//@access	Public
exports.getReservations = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'restaurant',
            select: 'name address tel'
        });
    } else {
        query = Reservation.find().populate({
            path: 'restaurant',
            select: 'name address tel'
        });
    }
    try {
        const reservations = await query;

        res.status(200).json({ 
            success: true, 
            count: reservations.length, 
            data: reservations 
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ 
            success: false,
            message: 'Cannot find reservation'
        });
    }
}

//@desc		Get single reservation
//@route	GET /api/v1/reservations/:id
//@access	Public
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name address tel'
        });

        if (!reservation) {
            return res.status(404).json({ 
                success: false,
                message: 'Cannot find reservation with the id of ' + req.params.id,
            });
        }

        res.status(200).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ 
            success: false,
            message: 'Cannot find reservation'
        });
    }
}

//@desc		Create new reservation
//@route	POST /api/v1/restaurants/:restaurantId/reservations
//@access	Private
exports.createReservation = async (req, res, next) => {
    try {
        req.body.restaurant = req.params.restaurantId;

        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ 
                success: false,
                message: 'Cannot find restaurant with the id of ' + req.params.restaurantId,
            });
        }

        req.body.user = req.user.id;

        const existedReservations = await Reservation.find({ 
            user: req.user.id,
            date: {$gte: new Date()}
        });

        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ 
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`,
            });
        }

        delete req.body.rating;

        const reservation = await Reservation.create(req.body);

        res.status(201).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 
            success: false,
            message: 'Cannot create reservation'
        });
    }
}

//@desc		Update reservation
//@route	PUT /api/v1/reservations/:id
//@access	Private
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ 
                success: false,
                message: 'Cannot find reservation with the id of ' + req.params.id,
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ 
                success: false,
                message: 'User ' + req.user.id + ' is not authorized to update this reservation',
            });
        }
        
        delete req.body.rating;

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 
            success: false,
            message: 'Cannot update reservation'
        });
    }
};

//@desc		Delete reservation
//@route	DELETE /api/v1/reservations/:id
//@access	Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ 
                success: false,
                message: 'Cannot find reservation with the id of ' + req.params.id,
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ 
                success: false,
                message: 'User ' + req.user.id + ' is not authorized to delete this reservation',
            });
        }

        await reservation.deleteOne();

        res.status(200).json({ 
            success: true, 
            data: {} 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 
            success: false,
            message: 'Cannot delete reservation'
        });
    }
};

//@desc		Update finished reservation rating
//@route	PUT /api/v1/reservations/:id/rating
//@access	Private
exports.updateRating = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ 
                success: false,
                message: 'Cannot find reservation with the id of ' + req.params.id,
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ 
                success: false,
                message: 'User ' + req.user.id + ' is not authorized to update this reservation',
            });
        }

        if (reservation.date > new Date()) {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot rate a reservation that is not finished',
            });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, { rating: req.body.rating }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 
            success: false,
            message: 'Cannot update reservation'
        });
    }
}