import { FaStar } from "react-icons/fa";
import { useState } from "react";

import StarRatingCSS from "./StarRating.module.css";

const StarRrating = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)].map((star, key) => {
        const ratingValue = key + 1;

        return (
          <label className={StarRatingCSS.container}>
            <input
              className={StarRatingCSS.label}
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <FaStar
              size={20}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              value={ratingValue}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      <span>{rating}</span>
    </div>
  );
};

export default StarRrating;
