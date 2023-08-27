import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PuphubApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

/** Company Detail page.
 *
 * Renders information about company, along with the jobs at that company.
 *
 * Routed at /companies/:handle
 *
 * Routes -> CompanyDetail -> JobCardList
 */

function DogDetail() {
  const { id } = useParams();
  console.debug("DogDetail", "id=", id);

  const [dog, setDog] = useState(null);

  useEffect(function getDogDetails() {
    async function getDog() {
      setDog(await PuphubApi.getDog(id));
    }

    getDog();
  }, [id]);

  if (!dog) return <LoadingSpinner />;

  return ( 
      <div className="col-md-8 offset-md-2">
        <div className="card-body">
          <h6 className="card-title">
            {dog.name}
            {dog.image && <img src={dog.image}
                             alt={dog.name}
                             className="float-right ml-5" />}
          </h6>
          <p><small>{dog.breed}</small></p>
          <p><small>{dog.age}</small></p>
        </div>
      </div>
  );
}

export default DogDetail;
