import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import StarRatingCSS from "./StarRating.module.css";
import React from "react";

const StarRrating = ({ gameId }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const localStorageKey = `rating-${gameId}`;

  useEffect(() => {
    const savedRating = localStorage.getItem(localStorageKey);
    if (savedRating) {
      setRating(Number(savedRating));
    }
  }, [localStorageKey]);

  const handleClick = (value) => {
    setRating(value);
    localStorage.setItem(localStorageKey, value);
  };

  return (
    <div className={StarRatingCSS.main}>
      {[...Array(5)].map((_, key) => {
        const ratingValue = key + 1;
        return (
          <label className={StarRatingCSS.container} key={key}>
            <input
              className={StarRatingCSS.label}
              type="radio"
              name={`rating-${gameId}`}
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
            />
            <FaStar
              size={20}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      <span className={StarRatingCSS.rating}>{rating}</span>
    </div>
  );
};

export default StarRrating;
