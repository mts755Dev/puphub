import React from "react";
import { Link } from "react-router-dom";

import "./DogCard.css";

/** Show limited information about a dog
 *
 * Is rendered by DogList to show a "card" for each dog.
 *
 * DogList -> DogCard 
 */

function DogCard({ name, breed, age, image, id }) {
  console.debug("DogCard", image);

  return ( 
      <Link className="DogCard card" to={`/dogs/${id}`}>
        <div className="card-body">
          <h6 className="card-title">
            {name}
            {image && <img src={image}
                             alt={name}
                             className="float-right ml-5" />}
          </h6>
          <p><small>{breed}</small></p>
          <p><small>{age}</small></p>
        </div>
      </Link>
  );
}

export default DogCard;