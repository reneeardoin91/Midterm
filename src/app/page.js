// Import the restaurant list UI component that renders the page content.
import RestaurantListings from "@/src/components/RestaurantListings.jsx";
// Import the Firestore helper that fetches restaurant data.
import { getRestaurants } from "@/src/lib/firebase/firestore.js";
// Import the server-side Firebase app helper used to authenticate requests.
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
// Import Firestore's database factory so the server app can be passed to queries.
import { getFirestore } from "firebase/firestore";

// Force Next.js to render this route on the server instead of building a static HTML file.
// Without this line, during the build process, Next.js would treat this route as static.

// Mark this route as dynamically rendered so it is not pre-rendered as a static page.
export const dynamic = "force-dynamic";

// This line also forces this route to be server-rendered, but it is currently disabled.
// export const revalidate = 0;

// Define the home page component as an async server component.
export default async function Home(props) {
  // Read the query parameters from the URL to support server-side filtering.
  const searchParams = await props.searchParams;
  // Use searchParams so filters can be applied on the server before rendering, e.g. ?city=London&category=Indian&sort=Review.
  // This allows search and sorting rules to be handled before the page is sent to the browser.
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  // Create a Firestore instance tied to the authenticated server app.
  const restaurants = await getRestaurants(
    // Pass the authenticated Firestore instance to the restaurant query.
    getFirestore(firebaseServerApp),
    // Pass the current URL filters into the query.
    searchParams
  );
  // Return the page layout with the restaurant list and the active filters.
  return (
    <main className="main__home">
      {/* Render the list of restaurants with the fetched data and query parameters. */}
      <RestaurantListings
        {/* Pass the restaurant data to the client component for initial rendering. */}
        initialRestaurants={restaurants}
        {/* Pass the current search parameters so the client can keep the UI in sync. */}
        searchParams={searchParams}
      />
    </main>
  );
}
