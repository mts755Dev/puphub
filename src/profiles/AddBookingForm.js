import React, { useState, useContext, useEffect } from "react";
import Alert from "../common/Alert";
import PuphubApi from "../api/api";
import UserContext from "../auth/UserContext";

function AddBookingForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [dogs, setDogs] = useState([]);
  const [formData, setFormData] = useState({
    username: currentUser.name,
    dog_id: "",
    start_date: "",
    end_date: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  useEffect(function getUsersDogsOnMount() {
    async function search() {
      try {
        const dogsData = await PuphubApi.getUsersDogs(currentUser.username);
        setDogs(dogsData);
      } catch (error) {
        console.error("Error fetching user's dogs:", error);
      }
    }
    search();
  }, [currentUser.username]);

  async function handleSubmit(evt) {
    evt.preventDefault();

    const bookingData = {
      username: currentUser.username,
      dog_id: formData.dog_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      // Call API to add booking
      await PuphubApi.addBooking(bookingData, currentUser.username);
      setSaveConfirmed(true);
      setTimeout(() => {
        setSaveConfirmed(false);
      }, 3000);
    } catch (error) {
      setFormErrors([error[0].error]);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h3>Add Booking</h3>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Select Dog</label>
              <select
                name="dog_id"
                className="form-control"
                value={formData.dog_id}
                onChange={handleChange}
              >
                <option value="">Select a Dog</option>
                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Starting Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group">
              <label>Ending Date</label>
              <input
                type="date"
                name="end_date"
                className="form-control"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
              />
            </div>

            {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
            {saveConfirmed && <Alert type="success" messages={["Booking added successfully."]} />}

            <button className="btn btn-primary btn-block mt-4" onClick={handleSubmit}>
              Add Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBookingForm;
