import { useEffect } from "react";
import ListingCard from "../../Components/ListingCard/ListingCard";
import { fetchPokemon } from "../../Utils/ApiHandler/ApiHandler";
import { useState } from "react";
export default function Listing() {
  let [tempStatePokemonData, setTempStatePokemonData] = useState(null);
  const fetchThesePokemons = [
    "https://pokeapi.co/api/v2/pokemon/6/",
    "https://pokeapi.co/api/v2/pokemon/1/",
    "https://pokeapi.co/api/v2/pokemon/10/",
  ];
  const [statePokemonObjs, setStatePokemonObjs] = useState(null);
  useEffect(() => {
    async function makeAsyncCall() {
      const fetchedPokemonObjs = await Promise.all(
        fetchThesePokemons.map(async (pokemonUrl) => {
          const response = await fetchPokemon(pokemonUrl);
          return response;
        })
      );
      console.log(fetchedPokemonObjs);
      setStatePokemonObjs([...fetchedPokemonObjs]);
    }
    makeAsyncCall();
  }, []);

  useEffect(() => {
    console.log(statePokemonObjs);
  }, [statePokemonObjs]);

  return (
    <div className="p-[1rem] flex flex-col gap-[.5rem]">
      <h2 className="text-[2rem] font-medium">Pokedex</h2>
      <div className=" grid grid-cols-3 w-[65rem]">
        {statePokemonObjs &&
          statePokemonObjs.map((pokemonObj) => {
            return <ListingCard key={pokemonObj.id} pokemonObj={pokemonObj} />;
          })}
      </div>
    </div>
  );
}
