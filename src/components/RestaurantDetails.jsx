// This component shows book metadata and offers image-upload and review actions.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";

const RestaurantDetails = ({
  restaurant,
  userId,
  handleRestaurantImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      {restaurant.photo ? (
        <img src={restaurant.photo} alt={`Cover for ${restaurant.name}`} />
      ) : (
        <div className={`detail-cover detail-cover--${restaurant.price || 1}`}>
          <span>Dungeon Crawler Carl</span>
          <strong>{restaurant.name}</strong>
          <span>Matt Dinniman · Book {restaurant.price || 1}</span>
        </div>
      )}

      <div className="actions">
        {userId && (
          <img
            alt="Write a book review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleRestaurantImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{restaurant.name}</h2>

          <div className="restaurant__rating">
            <ul>{renderStars(restaurant.avgRating)}</ul>

            <span>({restaurant.numRatings})</span>
          </div>

          <p>
            {restaurant.category || "LitRPG · Fantasy"} · Book{" "}
            {restaurant.price || 1}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default RestaurantDetails;
