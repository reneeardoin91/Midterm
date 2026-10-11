// Import the fake restaurant data generator used to seed sample restaurants and reviews.
import { generateFakeRestaurantsAndReviews } from "@/src/lib/fakeRestaurants.js";

// Import the Firestore APIs required for querying, listening to changes, and writing restaurant data.
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";

// Import the shared Firestore database instance configured for the app.
import { db } from "@/src/lib/firebase/clientApp";

// Update a restaurant document so it stores a new public image URL.
export async function updateRestaurantImageReference(
  restaurantId,
  publicImageUrl
) {
  // Create a reference to the restaurant document by using its collection and ID.
  const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
  // Only update if the reference was created successfully.
  if (restaurantRef) {
    await updateDoc(restaurantRef, { photo: publicImageUrl });
  }
}

// This helper is a placeholder for future rating-update logic and currently exits immediately.
const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  return;
};

// This helper is a placeholder for adding a review and currently exits immediately.
export async function addReviewToRestaurant(db, restaurantId, review) {
  return;
}

// Apply any query filters for category, city, price, and sorting to a Firestore query.
function applyQueryFilters(q, { category, city, price, sort }) {
  // Add a category filter when a category value was provided.
  if (category) {
    q = query(q, where("category", "==", category));
  }
  // Add a city filter when a city value was provided.
  if (city) {
    q = query(q, where("city", "==", city));
  }
  // Add a price filter by checking the length of the price string.
  if (price) {
    q = query(q, where("price", "==", price.length));
  }
  // Sort by average rating by default or when the user requests rating sorting.
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    // Otherwise, sort by review count when the user requests review sorting.
    q = query(q, orderBy("numRatings", "desc"));
  }
  // Return the query with all selected filters applied.
  return q;
}

// Fetch all restaurants that match the provided filters.
export async function getRestaurants(db = db, filters = {}) {
  // Start with a query against the restaurants collection.
  let q = query(collection(db, "restaurants"));

  // Apply any category, city, price, or sort filters.
  q = applyQueryFilters(q, filters);
  // Run the Firestore query and get the matching documents.
  const results = await getDocs(q);
  // Convert every Firestore document into a plain object with an ID and JavaScript Date timestamp.
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Convert the Firestore timestamp to a JavaScript Date so it can be passed to client components.
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Create a live listener for restaurants that match the supplied filters.
export function getRestaurantsSnapshot(cb, filters = {}) {
  // Ensure the callback is a function before attaching a listener.
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  // Start with the restaurant collection query.
  let q = query(collection(db, "restaurants"));
  // Apply any optional filters.
  q = applyQueryFilters(q, filters);

  // Subscribe to snapshot updates for the restaurants query.
  return onSnapshot(q, (querySnapshot) => {
    // Map each matched document into a plain object with a converted timestamp.
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JavaScript Date objects before returning data.
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    // Send the latest list to the provided callback.
    cb(results);
  });
}

// Fetch a single restaurant by its Firestore document ID.
export async function getRestaurantById(db, restaurantId) {
  // Reject empty or missing IDs.
  if (!restaurantId) {
    console.log("Error: Invalid ID received: ", restaurantId);
    return;
  }
  // Build a document reference for the target restaurant.
  const docRef = doc(db, "restaurants", restaurantId);
  // Retrieve the restaurant document from Firestore.
  const docSnap = await getDoc(docRef);
  // Return the restaurant data with a real JavaScript Date timestamp.
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

// Listen for real-time changes to a specific restaurant document.
export function getRestaurantSnapshotById(restaurantId, cb) {
  // Reject empty or missing IDs.
  if (!restaurantId) {
    console.log("Error: Invalid ID received: ", restaurantId);
    return;
  }

  // Ensure the callback is a function before attaching the listener.
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  // Create the document reference for the target restaurant.
  const docRef = doc(db, "restaurants", restaurantId);
  // Attach a live snapshot listener to the restaurant document.
  return onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    });
  });
}

// Fetch all reviews for a restaurant ordered by newest to oldest.
export async function getReviewsByRestaurantId(db, restaurantId) {
  // Reject empty or missing restaurant IDs.
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  // Query the ratings subcollection for this restaurant and sort newest first.
  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"),
    orderBy("timestamp", "desc")
  );

  // Fetch the matching review documents.
  const results = await getDocs(q);
  // Convert each review into a plain object with a Date timestamp.
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to JavaScript Date objects before returning them.
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Listen for real-time changes to a restaurant's reviews.
export function getReviewsSnapshotByRestaurantId(restaurantId, cb) {
  // Reject empty or missing restaurant IDs.
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  // Build the ratings subcollection query ordered by newest review first.
  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"),
    orderBy("timestamp", "desc")
  );
  // Attach a live listener to the review query.
  return onSnapshot(q, (querySnapshot) => {
    // Map each review document into a plain object with a Date timestamp.
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Convert the Firestore review timestamp into a JavaScript Date.
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    // Send the latest reviews to the consumer callback.
    cb(results);
  });
}

// Insert fake restaurant and review data into Firestore for testing or demo purposes.
export async function addFakeRestaurantsAndReviews() {
  // Generate the sample restaurant and rating payloads.
  const data = await generateFakeRestaurantsAndReviews();
  // Loop through every generated restaurant entry.
  for (const { restaurantData, ratingsData } of data) {
    try {
      // Add the restaurant document to the restaurants collection.
      const docRef = await addDoc(
        collection(db, "restaurants"),
        restaurantData
      );

      // Add each generated review under the restaurant's ratings subcollection.
      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "restaurants", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      // Log a general error if the document insert fails.
      console.log("There was an error adding the document");
      // Log the original error for debugging and troubleshooting.
      console.error("Error adding document: ", e);
    }
  }
}
