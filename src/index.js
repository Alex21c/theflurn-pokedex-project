import React from "react";
import ReactDOM from "react-dom/client";
import NotFound from "./Pages/NotFound/NotFound";
import App from "./App";
import Listing from "./Pages/Listing/Listing";
import Detail from "./Pages/Detail/Detail";
import Search from "./Pages/Search/Search";
import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import ListBookmarkedPokemons from "./Pages/ListBookmarkedPokemons/ListBookmarkedPokemons";
const router = createBrowserRouter([
  {
    path: "/bookmarked-pokemons",
    element: <ListBookmarkedPokemons />,
    errorElement: <NotFound />,
  },
  {
    path: "/",
    element: <Listing />,
    errorElement: <NotFound />,
  },
  {
    path: "/search",
    element: <Search />,
    errorElement: <NotFound />,
  },
  {
    path: "/detail/:pokemonID",
    element: <Detail />,
    errorElement: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
