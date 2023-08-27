import React, { useState, useEffect, useContext } from "react";
import SearchForm from "../common/SearchForm";
import Alert from "../common/Alert";
import PuphubApi from "../api/api";
import BookingCard from "./BookingCard";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";

/** Show page with list of dogs.
 *
 * On mount, loads dogs from API.
 * Re-loads filtered dogs on submit from search form.
 *
 * This is routed to at /dogs
 *
 * Routes -> { DogCard, SearchForm }
 */

function BookingList() {
  console.debug("BookingList");

  const [bookings, setBookings] = useState(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  useEffect(function getBookingsOnMount() {
    console.debug("DogList useEffect getDogsOnMount");
    search();
  }, []);

  /** Triggered by search form submit; reloads dogs. */
  async function search() {
    let bookings = await PuphubApi.getBookings(currentUser.username);
    setBookings(bookings);
    setTimeout(() => {
      setSaveConfirmed(false);
    }, 3000);
  }
  const handleDelete = async (id) => {
    await PuphubApi.deleteBooking(id);
    setSaveConfirmed(true);
    setBookings(prevBookings => prevBookings.filter(d => d.id !== id));
    setTimeout(() => {
      setSaveConfirmed(false);
    }, 3000);
  }

  //   if (!bookings) return <LoadingSpinner />;
  if (!bookings) return "NO BOOKINGS";

  return (
    <div className="CompanyList col-md-8 offset-md-2">
      {bookings.length
        ? (
          <div>
            <div className="CompanyList-list">
              {bookings.map(b => (
                <BookingCard
                  id={b.id}
                  username={b.username}
                  dog_id={b.dog_id}
                  start_date={b.start_date}
                  end_date={b.end_date}
                  onDelete={handleDelete}
                  saveConfirmed={saveConfirmed}
                />
              ))}
            </div>
            {saveConfirmed && <Alert type="success" messages={["Booking deleted successfully."]} />}
          </div>
        ) : (
          <p className="lead">Sorry, no results were found!</p>
        )}
    </div>
  );
}

export default BookingList;
