const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId)

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`
                        ],
                    }
                }
            }
        ]
    })

    res.status(200).json({
        status: 'success',
        session
    })
})

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//     // This is only temporary, because it's unsecure: everyone can make bookings without paying
//     const { tour, user, price } = req.query;

//     if (!tour && !user && !price) return next();

//     await Booking.create({ tour, user, price });

//     res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.line_items[0].price_data.unit_amount / 100;

    if (!tour && !user && !price) return;

    await Booking.create({ tour, user, price });
}

exports.webhookCheckout = catchAsync(async (req, res, next) => {
    const signature = req.headers['stripe-signature'];

 let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, 'endpointSecret come from Stripe dashboard');
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await createBookingCheckout(session);
  }

  res.status(200).json({ received: true });
})

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);