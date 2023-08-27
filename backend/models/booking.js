"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for bookings. */

class Booking {


  static async createBooking(bookingData) {
    const result = await db.query(
      `INSERT INTO bookings (username, dog_id, start_date, end_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, dog_id, start_date, end_date`,
      [bookingData.username, bookingData.dog_id, bookingData.start_date, bookingData.end_date]
    );
    const booking = result.rows[0];
    return booking;
  }

  static async isDateRangeFullyBooked(start_date, end_date) {
    const result = await db.query(
      `SELECT COUNT(*) AS booking_count
       FROM bookings
       WHERE start_date >= $1 AND end_date <= $2
       GROUP BY start_date`,
      [start_date, end_date]
    );

    return result.rows.some(row => row.booking_count >= 5);
  }

  /** Create a booking (from data), update db, return new booking data.
   *
   * data should be { date, dog_id, username }
   *
   * Returns { id, date, dog_id, username }
   *
   * Throws BadRequestError if booking already in database.
   * */

  static async create({ date, dog_id, user_id }) {
    const duplicateCheck = await db.query(
      `SELECT date
           FROM bookings
           WHERE date = $1`,
      [date]);

    if (duplicateCheck.rows.length >= 3)
      throw new BadRequestError(`This date is full: ${date}`);

    const result = await db.query(
      `INSERT INTO bookings
           (date, dog_id, user_id)
           VALUES ($1, $2, $3,)
           RETURNING id, date, dog_id, user_id`,
      [
        date,
        dog_id,
        user_id,
      ],
    );
    const booking = result.rows[0];

    return booking;
  }

  //FIND ALL BOOKINGS FOR A USER
  // Double check the logic with Julie
  static async userBookings(username) {
    const result = await db.query(
      `SELECT b.id,
                  b.start_date,
                  b.end_date,
                  b.dog_id,
                  b.username
           FROM bookings b
           LEFT JOIN users AS u ON b.username = u.username
           WHERE u.username = $1
           ORDER BY start_date`,
      [username]
    );
    const bookings = result.rows;
    return bookings;
  }


  static async bookingsForDate(date) {
    const result = await db.query(
      `SELECT b.id,
                  b.date,
                  b.dog_id,
                  b.user_id
           FROM bookings b
           WHERE b.date = $1`,
      [date]
    );

    return result.rows;
  }



  /** Find all bookings.
   *
   * Returns [{ id, date, dog_id, username }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id,
                  date,
                  dog_id AS "dogID",
                  user_id
           FROM bookings
           ORDER BY date`,
    );

    return result.rows;
  }

  /** Update booking data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        date: "date",
        dogId: "dog_id",
      });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE bookings
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                date,
                                user_id,
                                dog_id AS "dogId"`;
    const result = await db.query(querySql, [...values, id]);
    const booking = result.rows[0];

    if (!booking) throw new NotFoundError(`No booking: ${id}`);

    return booking;
  }

  /** Delete given booking from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM bookings
           WHERE id = $1
           RETURNING id`,
      [id]);
    const booking = result.rows[0];

    if (!booking) throw new NotFoundError(`No booking with ID of: ${id}`);
  }
}


module.exports = Booking;
