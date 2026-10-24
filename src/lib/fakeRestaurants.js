import { getRandomDateAfter, getRandomDateBefore } from "@/src/lib/utils.js";
import { Timestamp } from "firebase/firestore";

const books = [
  { name: "Dungeon Crawler Carl", genre: "LitRPG" },
  { name: "Carl's Doomsday Scenario", genre: "Dark Comedy" },
  { name: "The Dungeon Anarchist's Cookbook", genre: "Fantasy" },
  { name: "The Gate of the Feral Gods", genre: "Science Fiction" },
  { name: "The Butcher's Masquerade", genre: "LitRPG" },
  { name: "The Eye of the Bedlam Bride", genre: "Dark Comedy" },
  { name: "This Inevitable Ruin", genre: "Fantasy" },
  { name: "A Parade of Horribles", genre: "Science Fiction" },
];

const sampleReviews = [
  {
    rating: 5,
    text: "A wildly entertaining installment with clever dungeon challenges and a great sense of momentum.",
  },
  {
    rating: 4,
    text: "Funny, chaotic, and surprisingly heartfelt. I wanted to keep reading.",
  },
  {
    rating: 5,
    text: "The mix of game-like progression, sharp humor, and memorable characters works so well.",
  },
];

export async function generateFakeRestaurantsAndReviews() {
  return books.map((book, index) => {
    const bookTimestamp = Timestamp.fromDate(getRandomDateBefore());
    const ratingsData = sampleReviews.map((review, reviewIndex) => ({
      ...review,
      userId: `Sample Reader ${reviewIndex + 1}`,
      timestamp: Timestamp.fromDate(getRandomDateAfter(bookTimestamp.toDate())),
    }));
    const sumRating = ratingsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return {
      restaurantData: {
        type: "book",
        name: book.name,
        category: book.genre,
        price: index + 1,
        avgRating: sumRating / ratingsData.length,
        numRatings: ratingsData.length,
        sumRating,
        photo: "",
        timestamp: bookTimestamp,
      },
      ratingsData,
    };
  });
}
