import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import DogList from "../dogs/DogList";
import DogCard from "../dogs/DogCard";
import DogDetail from "../dogs/DogDetail";
import UsersDogList from "../usersdogs/UsersDogList";
import BookingList from "../bookings/BookingsList";
import AddBookingForm from "../profiles/AddBookingForm";
// import CompanyList from "../companies/CompanyList";
// import JobList from "../jobs/JobList";
// import CompanyDetail from "../companies/CompanyDetail";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";
import AddDogForm from "../profiles/AddDogForm";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`,
  );

  return (
    <div className="pt-5">
      <Switch>

        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>

        <PrivateRoute exact path="/dogs">
          <DogList />
        </PrivateRoute>

        <PrivateRoute exact path="/bookings">
          <BookingList />
        </PrivateRoute>

        <PrivateRoute exact path="/bookings/add">
          <AddBookingForm />
        </PrivateRoute>

        <PrivateRoute exact path="/users-dogs">
          <UsersDogList />
        </PrivateRoute>
        <PrivateRoute exact path="/adddog">
          <AddDogForm />
        </PrivateRoute>

        {/* USERS DOGS? */}
        {/* <PrivateRoute exact path="/usersdogs">
            <UserDogsTest />
          </PrivateRoute> */}


        <PrivateRoute exact path="/dogs/:id">
          <DogDetail />
        </PrivateRoute>

        <PrivateRoute path="/profile">
          <ProfileForm />
        </PrivateRoute>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;
