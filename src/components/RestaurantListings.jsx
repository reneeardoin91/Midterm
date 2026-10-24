"use client";

// This component handles the book listings page and its URL-backed filters.

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getRestaurantsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const BookItem = ({ book }) => (
  <li key={book.id}>
    <Link href={`/book/${book.id}`}>
      <ActiveBook book={book} />
    </Link>
  </li>
);

const ActiveBook = ({ book }) => (
  <div>
    <BookCover book={book} />
    <BookDetails book={book} />
  </div>
);

const BookCover = ({ book }) => (
  <div className={`book-cover book-cover--${book.price || 1}`}>
    {book.photo ? (
      <img src={book.photo} alt={`Cover for ${book.name}`} />
    ) : (
      <div className="book-cover__art" aria-label={`Book ${book.price || 1}`}>
        <span className="book-cover__series">Dungeon Crawler Carl</span>
        <span className="book-cover__number">
          {String(book.price || 1).padStart(2, "0")}
        </span>
        <span className="book-cover__title">{book.name}</span>
        <span className="book-cover__author">Matt Dinniman</span>
      </div>
    )}
  </div>
);

const BookDetails = ({ book }) => (
  <div className="restaurant__details">
    <p className="book-details__eyebrow">Book {book.price || 1}</p>
    <h2>{book.name}</h2>
    <BookRating book={book} />
    <p className="restaurant__meta">{book.category || "LitRPG · Fantasy"}</p>
  </div>
);

const BookRating = ({ book }) => (
  <div className="restaurant__rating">
    <ul>{renderStars(book.avgRating)}</ul>
    <span>{book.numRatings || 0} reviews</span>
  </div>
);

export default function RestaurantListings({
  initialRestaurants,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [books, setBooks] = useState(initialRestaurants);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getRestaurantsSnapshot((data) => {
      setBooks(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <div className="catalog-heading">
        <div>
          <p className="catalog-heading__eyebrow">The series</p>
          <h2>Choose your next floor</h2>
        </div>
        <p>Eight books. One very strange apocalypse.</p>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      {books.length ? (
        <ul className="restaurants">
          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </ul>
      ) : (
        <div className="empty-catalog">
          <p className="empty-catalog__icon" aria-hidden="true">
            📚
          </p>
          <h3>No books on this floor yet.</h3>
          <p>Sign in and choose “Add sample books” from the profile menu.</p>
        </div>
      )}
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
