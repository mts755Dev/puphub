import React, { useState, useEffect } from "react";
import "./BookingCard.css";
import PuphubApi from "../api/api";

function BookingCard({ id, username, dog_id, start_date, end_date, onDelete }) {
  const [dog, setDog] = useState(null);

  useEffect(function getDogDetails() {
    async function getDog() {
      const fetchedDog = await PuphubApi.getDog(dog_id);
      setDog(fetchedDog);
    }

    getDog();
  }, [dog_id]);

  const handleDelete = () => {
    onDelete(id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="BookingCard card">
      <div className="card-body">
        <h6 className="card-title ml-3 mt-3">
          {username}
          {dog && dog.image && (
            <img
              src={dog.image}
              alt={dog.name}
              className="float-right ml-5"
            />
          )}
          <br />
          {dog && dog.name}
          <br />
          {formatDate(start_date)}
          <br />
          {formatDate(end_date)}
        </h6>
      </div>
      <button className="btn btn-primary btn-block mt-4" onClick={handleDelete}>
        Delete Booking
      </button>
    </div>
  );
}

export default BookingCard;
