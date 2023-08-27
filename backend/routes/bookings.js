"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Booking = require("../models/booking");
const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const bookingSchema = require("../schemas/bookingSchema.json");

const router = express.Router();

//Getting dates in correct format (need to update and delete the time of day on it)
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

//UNCOMMENT OUT WHEN DOING ADMIN

// router.post("/", ensureAdmin, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, userNewSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const user = await User.register(req.body);
//     const token = createToken(user);
//     return res.status(201).json({ user, token });
//   } catch (err) {
//     return next(err);
//   }
// });


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

// router.get("/", ensureAdmin, async function (req, res, next) {
//   try {
//     const users = await User.findAll();
//     return res.json({ users });
//   } catch (err) {
//     return next(err);
//   }
// });


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, bookingSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { start_date, end_date } = req.body;

    const isFullyBooked = await Booking.isDateRangeFullyBooked(start_date, end_date);

    if (isFullyBooked) {
      throw new BadRequestError({ error: "Selected date range is fully booked." });
    }
    const booking = await Booking.createBooking(req.body, req.params.username);
    return res.status(201).json({ booking });
  } catch (error) {
    return next(error);

  }
}
);

router.get("/:username", async function (req, res, next) {
  try {
    const bookings = await Booking.userBookings(req.params.username);
    return res.json({ bookings });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

// UNCOMMENT OUT WHEN BOOKING UPDATE SCHEMA IS DONE

// router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, userUpdateSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const user = await User.update(req.params.username, req.body);
//     return res.json({ user });
//   } catch (err) {
//     return next(err);
//   }
// });


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", async function (req, res, next) {
  try {
    await Booking.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/jobs/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

// router.post("/:username/jobs/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
//   try {
//     const jobId = +req.params.id;
//     await User.applyToJob(req.params.username, jobId);
//     return res.json({ applied: jobId });
//   } catch (err) {
//     return next(err);
//   }
// });


module.exports = router;
