import { useEffect } from "react";
import ListingCard from "../../Components/ListingCard/ListingCard";
import { fetchPokemon } from "../../Utils/ApiHandler/ApiHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPokemonById } from "../../Utils/ApiHandler/ApiHandler";
export default function ListBookmarkedPokemons() {
  useEffect(() => {
    document.title = "Bookmarked Pokemons";
  }, []);

  const navigate = useNavigate();
  const fetchThesePokemons = [
    "https://pokeapi.co/api/v2/pokemon/6/",
    "https://pokeapi.co/api/v2/pokemon/1/",
    "https://pokeapi.co/api/v2/pokemon/10/",
  ];
  const [statePokemonObjs, setStatePokemonObjs] = useState(null);

  function readLocalStorage() {
    return JSON.parse(localStorage.getItem("stateBookmarkedPokemons")) || [];
  }
  const [stateBookmarkedPokemons, setStateBookmarkedPokemons] = useState(
    readLocalStorage()
  );

  useEffect(() => {
    async function makeAsyncCall() {
      const fetchedPokemonObjs = await Promise.all(
        stateBookmarkedPokemons.map(async (pokemonId) => {
          const response = await fetchPokemonById(pokemonId);
          return response;
        })
      );

      setStatePokemonObjs([...fetchedPokemonObjs]);
    }
    makeAsyncCall();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="p-[1rem] flex flex-col gap-[.5rem]">
        <div className="flex gap-[.5rem] items-center">
          <i
            className="fa-solid fa-arrow-left text-[3rem] cursor-pointer text-emerald-700"
            title="back to home"
            onClick={() => navigate("/")}
          ></i>

          <h2 className="text-[2rem] font-medium">Bookmarked Pokemons</h2>
        </div>
        <div
          id="divGridListingPage"
          className=" grid grid-cols-3 w-[65rem] gap-[.5rem]"
        >
          {statePokemonObjs &&
            statePokemonObjs.map((pokemonObj) => {
              return (
                <ListingCard
                  key={pokemonObj.id}
                  pokemonObj={pokemonObj}
                  navigate={navigate}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
