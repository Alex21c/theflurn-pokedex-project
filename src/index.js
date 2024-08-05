import React from "react";
import ReactDOM from "react-dom/client";
import NotFound from "./Pages/NotFound/NotFound";
import App from "./App";
import Listing from "./Pages/Listing/Listing";
import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Listing />,
    errorElement: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
