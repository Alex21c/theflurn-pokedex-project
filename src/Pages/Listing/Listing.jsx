import "./Listing.css";
import { useEffect } from "react";
import ListingCard from "../../Components/ListingCard/ListingCard";
import { fetchPokemon } from "../../Utils/ApiHandler/ApiHandler";
import { fetchPokemonByName } from "../../Utils/ApiHandler/ApiHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Loading from "../../Components/MUI/Loading";
import { pokemonGenerations } from "../../DB/pokemonData";
import { pokemonTypes } from "../../DB/pokemonData";
export default function Listing() {
  const navigate = useNavigate();
  const howManyPokemonsToShowOnce = 10;

  const stateNextUrlAllThePokemonsNoFilterRef = useRef(
    `https://pokeapi.co/api/v2/pokemon?&limit=${howManyPokemonsToShowOnce}`
  );
  const refPokemonObjs = useRef([]);
  const [stateLoading, setStateLoading] = useState(false);
  const refSelectedGeneration = useRef(null);
  const refSelectedFilterPokemonType = useRef(null);

  const statePokemonSpeciesCurrentGeneration = useRef([]);
  const stateFetchBeginForCurrentGeneration = useRef(0);
  const stateFetchEndForCurrentGeneration = useRef(0);

  function hideLoading() {
    setTimeout(() => {
      setStateLoading(false);
    }, 500);
  }

  async function getAllThePokemonsMatchingSelectedGeneration() {
    if (stateIsItResettingFilters) {
      return;
    }

    if (refSelectedGeneration.current.value === "allGenerations") {
      stateNextUrlAllThePokemonsNoFilterRef.current = `https://pokeapi.co/api/v2/pokemon?&limit=${howManyPokemonsToShowOnce}`;
      getAllThePokemonNoFilter();
      return;
    }
    const genObj = pokemonGenerations.find(
      (obj) => obj.name === refSelectedGeneration.current.value
    );
    if (genObj?.url) {
      setStateLoading(true);

      let response = await fetch(genObj.url);
      if (response) {
        response = await response.json();
        statePokemonSpeciesCurrentGeneration.current =
          response?.pokemon_species;
      }

      hideLoading();
    }
  }

  async function waitForNSeconds(delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

  async function showAllThePokemonsMatchingSelectedGeneration() {
    if (stateIsItResettingFilters) {
      return;
    }
    setStateLoading(true);
    stateFetchBeginForCurrentGeneration.current =
      stateFetchEndForCurrentGeneration.current;
    stateFetchEndForCurrentGeneration.current =
      stateFetchEndForCurrentGeneration.current + howManyPokemonsToShowOnce;
    let fetchedPokemonObjs = [];

    if (refSelectedFilterPokemonType.current.value === "allTypes") {
      const results = statePokemonSpeciesCurrentGeneration.current.slice(
        stateFetchBeginForCurrentGeneration.current,
        stateFetchEndForCurrentGeneration.current
      );

      fetchedPokemonObjs = await Promise.all(
        results.map(async (result) => {
          const response = await fetchPokemonByName(result?.name);
          return response;
        })
      );
    } else {
      setStateLoading(true);
      while (
        fetchedPokemonObjs.length < howManyPokemonsToShowOnce &&
        stateFetchEndForCurrentGeneration.current <
          statePokemonSpeciesCurrentGeneration.current.length
      ) {
        const results = statePokemonSpeciesCurrentGeneration.current.slice(
          stateFetchBeginForCurrentGeneration.current,
          stateFetchEndForCurrentGeneration.current
        );

        const tempfetchedPokemonObjs = await Promise.all(
          results.map(async (result) => {
            const response = await fetchPokemonByName(result?.name);
            if (
              response?.types.find(
                (obj) =>
                  obj?.type?.name === refSelectedFilterPokemonType.current.value
              )
            ) {
              return response;
            } else {
              return null;
            }
          })
        );

        fetchedPokemonObjs = [...fetchedPokemonObjs, ...tempfetchedPokemonObjs];
        fetchedPokemonObjs = fetchedPokemonObjs.filter(
          (value) => value !== null && value !== undefined
        );

        stateFetchBeginForCurrentGeneration.current =
          stateFetchEndForCurrentGeneration.current;
        stateFetchEndForCurrentGeneration.current =
          stateFetchEndForCurrentGeneration.current + howManyPokemonsToShowOnce;
      }
      hideLoading();
    }

    const bk = refPokemonObjs.current;
    refPokemonObjs.current = [...bk, ...fetchedPokemonObjs];
    setStatePokemonObjs([...bk, ...fetchedPokemonObjs]);
    hideLoading();
  }

  async function getAllThePokemonNoFilter() {
    setStateLoading(true);
    if (refSelectedFilterPokemonType.current.value === "allTypes") {
      let response = await fetch(stateNextUrlAllThePokemonsNoFilterRef.current);
      if (response) {
        response = await response.json();
        stateNextUrlAllThePokemonsNoFilterRef.current = response?.next;

        const results = response.results;
        const fetchedPokemonObjs = await Promise.all(
          results.map(async (result) => {
            const response = await fetchPokemon(result?.url);
            return response;
          })
        );

        const bk = refPokemonObjs.current;
        refPokemonObjs.current = [...bk, ...fetchedPokemonObjs];
        setStatePokemonObjs([...bk, ...fetchedPokemonObjs]);
      }
    } else {
      let fetchedPokemonObjs = [];
      while (
        fetchedPokemonObjs.length < howManyPokemonsToShowOnce &&
        stateNextUrlAllThePokemonsNoFilterRef.current
      ) {
        let response = await fetch(
          stateNextUrlAllThePokemonsNoFilterRef.current
        );
        if (response) {
          setStateLoading(true);
          response = await response.json();
          stateNextUrlAllThePokemonsNoFilterRef.current = response?.next;
          const results = response.results;
          const tempFetchedPokemonObjs = await Promise.all(
            results.map(async (result) => {
              const response = await fetchPokemon(result?.url);
              if (
                response?.types.find(
                  (obj) =>
                    obj?.type?.name ===
                    refSelectedFilterPokemonType.current.value
                )
              ) {
                return response;
              } else {
                return null;
              }
            })
          );

          fetchedPokemonObjs = [
            ...fetchedPokemonObjs,
            ...tempFetchedPokemonObjs,
          ];
          fetchedPokemonObjs = fetchedPokemonObjs.filter(
            (value) => value !== null && value !== undefined
          );
        }
      }

      const bk = refPokemonObjs.current;
      refPokemonObjs.current = [...bk, ...fetchedPokemonObjs];
      setStatePokemonObjs([...bk, ...fetchedPokemonObjs]);
    }

    hideLoading();
  }

  const [statePokemonObjs, setStatePokemonObjs] = useState([]);

  const handleScrollDebounced = (delay) => {
    let timeoutId = null;

    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(async () => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100
        ) {
          if (refSelectedGeneration.current.value === "allGenerations") {
            getAllThePokemonNoFilter();
          } else {
            await getAllThePokemonsMatchingSelectedGeneration();
            await showAllThePokemonsMatchingSelectedGeneration();
          }
        }
      }, delay);
    };
  };
  useEffect(() => {
    getAllThePokemonNoFilter();

    const handleScroll = handleScrollDebounced(500);
    window.addEventListener("scroll", handleScroll);
    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let [stateIsItResettingFilters, setStateIsItResettingFilters] =
    useState(false);

  async function handleBtnReset() {
    setStateIsItResettingFilters(true);
    refSelectedFilterPokemonType.current.value = "allTypes";
    refSelectedGeneration.current.value = "allGenerations";
    stateFetchBeginForCurrentGeneration.current = 0;
    stateFetchEndForCurrentGeneration.current = 0;
    refPokemonObjs.current = [];
    setStatePokemonObjs([]);
    stateNextUrlAllThePokemonsNoFilterRef.current = `https://pokeapi.co/api/v2/pokemon?&limit=${howManyPokemonsToShowOnce}`;

    await getAllThePokemonNoFilter();

    setTimeout(async () => {
      setStateIsItResettingFilters(false);
    }, 1000);
  }
  useEffect(() => {
    document.title = "theFlurn Pokedex Project";
  }, []);

  return (
    <div className="p-[1rem] flex flex-col gap-[.5rem] items-center relative">
      {stateLoading && <Loading />}
      <h2 className="text-[2rem] font-medium">Pokedex</h2>
      <div className="text-[2rem] text-emerald-700  flex gap-[1rem] ">
        <i
          onClick={() => navigate("/search")}
          className="fa-regular fa-magnifying-glass cursor-pointer"
        ></i>
        <i
          className="fa-solid fa-bookmark  cursor-pointer"
          onClick={() => navigate("/bookmarked-pokemons")}
        ></i>
      </div>

      {/* Filters */}
      <div id="divFiltersWrappper" className=" flex gap-[.5rem] mb-[1rem]">
        <select
          onChange={async () => {
            refPokemonObjs.current = [];
            stateFetchBeginForCurrentGeneration.current = 0;
            stateFetchEndForCurrentGeneration.current = 0;
            await getAllThePokemonsMatchingSelectedGeneration();
            await showAllThePokemonsMatchingSelectedGeneration();
          }}
          className="border p-[.5rem] pl-[1rem]  rounded-md focus:outline-none  text-xl"
          ref={refSelectedGeneration}
        >
          <option value="allGenerations">All Generations</option>
          {pokemonGenerations.map((obj) => {
            return (
              <option value={obj.name} key={obj.name}>
                {obj.name}
              </option>
            );
          })}
        </select>

        <select
          ref={refSelectedFilterPokemonType}
          className="border p-[.5rem] pl-[1rem]  rounded-md focus:outline-none  text-xl"
          onChange={async () => {
            refPokemonObjs.current = [];
            stateFetchBeginForCurrentGeneration.current = 0;
            stateFetchEndForCurrentGeneration.current = 0;
            await getAllThePokemonsMatchingSelectedGeneration();
            await showAllThePokemonsMatchingSelectedGeneration();
          }}
        >
          <option value="allTypes">All types</option>
          {pokemonTypes.map((obj) => {
            return (
              <option value={obj.name} key={obj.name}>
                {obj.name}
              </option>
            );
          })}
        </select>
        <button
          onClick={() => handleBtnReset()}
          className="transition-all  text-zinc-50 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 focus:outline-none focus:ring focus:ring-emerald-500  rounded-md cursor-pointer p-[.5rem] px-[1rem]    font-semibold text-2xl flex gap-2 align-center justify-center"
          title="Reset"
        >
          <i className="fa-sharp fa-solid fa-rotate-right"></i>Reset
        </button>
      </div>

      <div
        id="divGridListingPage"
        className="grid grid-cols-3 w-[62rem] gap-[1rem]"
      >
        {statePokemonObjs &&
          statePokemonObjs.map((pokemonObj) => {
            return (
              pokemonObj && (
                <ListingCard
                  key={pokemonObj?.name}
                  pokemonObj={pokemonObj}
                  navigate={navigate}
                />
              )
            );
          })}
      </div>

      <div>
        {!stateLoading && statePokemonObjs.length === 0 && (
          <h2 className="text-[1.3rem] font-semibold ">
            No Pokemon Found matching yours filters !
          </h2>
        )}
      </div>
    </div>
  );
}
