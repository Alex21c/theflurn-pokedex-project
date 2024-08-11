import "./Search.css";
import { useRef, useState } from "react";
import Loading from "../../Components/MUI/Loading";
import { fetchPokemonByName } from "../../Utils/ApiHandler/ApiHandler";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Search() {
  useEffect(() => {
    document.title = "Search Pokemon";
  }, []);

  let [statePokemonDoesNotExist, setStatePokemonDoesNotExist] = useState(false);
  let [stateMakingApiCall, setStateMakingApiCall] = useState(false);
  const navigate = useNavigate();
  const refInput = useRef(null);
  async function handleSearch(event) {
    event.preventDefault();
    const pokemonName = refInput.current.value;
    if (pokemonName !== "") {
      setStateMakingApiCall(true);
      // make an api call, if pokemon exist then redirect to pokemon detail page
      const fetchedPokemon = await fetchPokemonByName(pokemonName);

      // if not show msg pokemon doesn't exist
      if (!fetchedPokemon) {
        setStatePokemonDoesNotExist(true);
      } else {
        navigate(`/detail/${pokemonName}`);
      }
      setStateMakingApiCall(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div>
        <div className="flex gap-[1rem] items-center">
          <i
            className="fa-solid fa-arrow-left text-[3rem] cursor-pointer text-emerald-700"
            title="back to home"
            onClick={() => navigate("/")}
          ></i>
          <h2 className="text-[2rem] font-medium">Search</h2>
        </div>
        <form
          className="flex gap-[0.3rem] p-[.5rem] pl-[0]"
          onSubmit={(event) => handleSearch(event)}
        >
          <input
            id="inputSearch"
            ref={refInput}
            type="search"
            className="outline-none border p-[.5rem] rounded-md w-[25rem]"
            placeholder="Enter pokemon name, e.g. charizard"
          />
          <button>
            <i className="fa-regular fa-magnifying-glass cursor-pointer border p-[.5rem] px-[1rem] rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700  text-white"></i>
          </button>
        </form>

        <div>{stateMakingApiCall && <Loading />}</div>

        {statePokemonDoesNotExist && (
          <h3 className="font-medium text-[1.3rem] text-stone-700">
            Pokemon doesn't exist !
          </h3>
        )}
      </div>
    </div>
  );
}
