// import React from "react";
// import { Link } from "react-router-dom";

// import "./UsersDogCard.css";

// /** Show limited information about a dog
//  *
//  * Is rendered by DogList to show a "card" for each dog.
//  *
//  * DogList -> DogCard
//  */

// function UsersDogCard({ name, breed, age, image, id, onDelete }) {
//   console.debug("DogCard", image);

//   const handleDelete = () => {
//     onDelete(id);
//   };

//   return (
//       <Link className="DogCard card" to={`/dogs/${id}`}>
//         <div className="card-body">
//           <h6 className="card-title">
//             {name}
//             {image && <img src={image}
//                              alt={name}
//                              className="float-right ml-5" />}
//           </h6>
//           <p><small>Breed: {breed}</small></p>
//           <p><small>Age: {age}</small></p>
//           <button onClick={handleDelete}>Delete Dog</button>
//         </div>
//       </Link>
//   );
// }

// export default UsersDogCard;


import React from "react";
import { Link } from "react-router-dom";

import "./UsersDogCard.css";

function UsersDogCard({ name, breed, age, image, id, onDelete }) {
  console.debug("DogCard", image);

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div>
      <Link className="DogCard card" to={`/dogs/${id}`}>
        <div className="card-body">
          <h6 className="card-title">
            {name}
            {image && (
              <img src={image} alt={name} className="float-right ml-5" />
            )}
          </h6>
          <p>
            <small>Breed: {breed}</small>
          </p>
          <p>
            <small>Age: {age}</small>
          </p>
        </div>
      </Link>
      <button className="btn btn-primary btn-block mb-4" onClick={handleDelete}>Delete Dog</button>
    </div>
  );
}

export default UsersDogCard;
