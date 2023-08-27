import React, { useState, useEffect } from "react";
import SearchForm from "../common/SearchForm";
import PuphubApi from "../api/api";
import DogCard from "./DogCard";
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

function DogList() {
  console.debug("DogList");

  const [dogs, setDogs] = useState(null);

  useEffect(function getDogsOnMount() {
    console.debug("DogList useEffect getDogsOnMount");
    search();
  }, []);

  /** Triggered by search form submit; reloads dogs. */
  async function search(name) {
    let dogs = await PuphubApi.getDogs(name);
    setDogs(dogs);
  }

  if (!dogs) return <LoadingSpinner />;

  return (
      <div className="CompanyList col-md-8 offset-md-2">
        <SearchForm searchFor={search} />
        {dogs.length
            ? (
                <div className="CompanyList-list">
                  {dogs.map(d => (
                      <DogCard
                          key={d.id}
                          id={d.id}
                          name={d.name}
                          breed={d.breed}
                          age={d.age}
                          image={d.image}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default DogList;
