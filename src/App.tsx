import { RouterProvider } from "react-router-dom";
import router from "./router";
import "reflect-metadata";

// Unfortunately, I wasn't feeling well and had to miss some points.
// However, I'd like to share them here now, and I certainly would
// have implemented them if I had been in better health.

/* Things I could have done if I had time and good health */

// Add comments to each method to clarify the purpose
// Move the business logic from the UI components to separate hooks to keep the code clean
// Refactor some areas which could've been improved
// Add more test cases to insure the applicaiton stability

function App() {
  return <RouterProvider router={router} />;
}

export default App;
