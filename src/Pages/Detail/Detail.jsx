import "./Detail.css";
import { createMoveObj } from "../../Utils/ApiHandler/ApiHandler";
import { Navigate, useParams } from "react-router-dom";
import { fetchPokemonById } from "../../Utils/ApiHandler/ApiHandler";
import { useEffect } from "react";
import { useState } from "react";
import { backgrounds } from "../../CssStylesTailwind/CssStylesTailwind";
import { backgroundGradients } from "../../CssStylesTailwind/CssStylesTailwind";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { fetchPokemonByName } from "../../Utils/ApiHandler/ApiHandler";
import { createPokemonEvolutionObj } from "../../Utils/ApiHandler/ApiHandler";
const BorderLinearProgress = styled(LinearProgress)(
  ({ theme, backgroundcolor }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: backgroundcolor,
    },
  })
);

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Detail() {
  const navigate = useNavigate();
  const whichPokemonGameEdition = "firered-leafgreen";
  const { pokemonID } = useParams();
  const [statePokemonObj, setStatePokemonObj] = useState(null);
  useEffect(() => {
    document.title = statePokemonObj?.name;
  }, [statePokemonObj]);
  useEffect(() => {
    async function makeApiCall() {
      if (pokemonID) {
        setStatePokemonObj(await fetchPokemonById(pokemonID));
      }
    }

    makeApiCall();
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const name = statePokemonObj?.name;
  const types = [];
  statePokemonObj?.types &&
    statePokemonObj?.types.length > 0 &&
    statePokemonObj?.types.forEach((obj) => {
      types.push(obj?.type?.name);
    });
  const pokemonImg =
    statePokemonObj?.sprites?.other["official-artwork"]?.front_default;

  const abilities =
    statePokemonObj?.abilities &&
    statePokemonObj.abilities.map((abilityObj) => {
      return abilityObj.ability.name;
    });

  const id = statePokemonObj?.id;
  const backgroundGradient =
    backgroundGradients[types?.at(0)] || backgroundGradients.default;
  const background = backgrounds[types?.at(0)] || backgrounds.default;

  const greenStats = ["hp", "defense", "speed"];
  const [statePokemonMoves, setStatePokemonMoves] = useState([]);
  const [stateMovesLearntByLevelUp, setStateMovesLearntByLevelUp] = useState(
    []
  );
  const [
    stateMovesLearntByTechnicalMachines,
    setStateMovesLearntByTechnicalMachines,
  ] = useState([]);
  const [statePokemonEvolutionObj, setStatePokemonEvolutionObj] = useState({});
  useEffect(() => {
    async function makeApiCall() {
      const result = await createPokemonEvolutionObj(
        statePokemonObj?.id || null
      );
      const customEvolutionDetailsObj = [];
      let data = {};
      if (result?.chain) {
        const baseForm = result?.chain;

        data.name = baseForm?.species?.name;
        data.level = null;
        if (baseForm?.species?.name) {
          const pokemonObj = await fetchPokemonByName(baseForm?.species?.name);
          data.img =
            pokemonObj?.sprites?.other["official-artwork"]?.front_default;
        }

        data.url = baseForm?.species?.url;
        customEvolutionDetailsObj.push(data);
      }
      data = {};

      if (result?.chain?.evolves_to) {
        let evolution = result.chain.evolves_to;
        evolution = evolution.at(0);

        data.name = evolution?.species?.name;
        if (evolution?.species?.name) {
          const pokemonObj = await fetchPokemonByName(evolution?.species?.name);
          data.img =
            pokemonObj?.sprites?.other["official-artwork"]?.front_default;
        }
        data.level = evolution?.evolution_details.at(0)?.min_level;
        data.url = evolution?.species?.url;

        customEvolutionDetailsObj.push(data);

        evolution = evolution?.evolves_to;
        while (evolution?.length > 0) {
          evolution = evolution.at(0);
          data = {};
          data.name = evolution?.species?.name;
          if (evolution?.species?.name) {
            const pokemonObj = await fetchPokemonByName(
              evolution?.species?.name
            );
            data.img =
              pokemonObj?.sprites?.other["official-artwork"]?.front_default;
          }
          data.level = evolution?.evolution_details.at(0)?.min_level;
          data.url = evolution?.species?.url;
          customEvolutionDetailsObj.push(data);
          evolution = evolution?.evolves_to;
        }
      }

      setStatePokemonEvolutionObj(customEvolutionDetailsObj);
    }
    makeApiCall();
  }, [statePokemonObj]);

  useEffect(() => {
    async function makeApiCall() {
      const pokemonMoves = statePokemonObj?.moves.map((obj) => {
        return {
          ...obj,
          ...obj?.version_group_details.find((versionObj) => {
            return versionObj?.version_group?.name === whichPokemonGameEdition;
          }),
        };
      });

      if (pokemonMoves?.length > 0) {
        const movesWithDetails = await Promise.all(
          pokemonMoves.map(async (obj) => {
            const moveObj = await createMoveObj(obj?.move?.url);
            return {
              ...obj,
              moveObj,
            };
          })
        );
        const movesLearntByLevelUp = [];

        movesWithDetails.map((obj) => {
          if (
            obj?.version_group_details.at(0)?.move_learn_method?.name ===
            "level-up"
          ) {
            if (obj?.moveObj?.power && obj?.moveObj?.accuracy) {
              movesLearntByLevelUp.push(obj);
            }
          }
        });
        const movesLearntByTechnicalMachines = [];
        movesWithDetails.map((obj) => {
          if (
            obj?.version_group_details.at(0)?.move_learn_method?.name ===
            "machine"
          ) {
            if (obj?.moveObj?.power && obj?.moveObj?.accuracy) {
              movesLearntByTechnicalMachines.push(obj);
            }
          }
        });

        setStateMovesLearntByLevelUp(movesLearntByLevelUp);
        setStateMovesLearntByTechnicalMachines(movesLearntByTechnicalMachines);
      }
    }

    makeApiCall();
  }, [statePokemonObj]);

  function saveToLocalStorage() {
    localStorage.setItem(
      "stateBookmarkedPokemons",
      JSON.stringify(stateBookmarkedPokemons)
    );
  }

  function readLocalStorage() {
    return JSON.parse(localStorage.getItem("stateBookmarkedPokemons")) || [];
  }

  const [stateBookmarkedPokemons, setStateBookmarkedPokemons] = useState(
    readLocalStorage()
  );

  function toggleBookmark(pokemonID) {
    const previousState = stateBookmarkedPokemons;
    if (!previousState.includes(pokemonID)) {
      // add to bookmark
      previousState.push(pokemonID);
    } else {
      // remove from bookmarks
      const idx = previousState.indexOf(pokemonID);
      previousState.splice(idx, 1);
    }
    setStateBookmarkedPokemons([...previousState]);
  }

  useEffect(() => {
    saveToLocalStorage();
  }, [stateBookmarkedPokemons]);

  return (
    <div className="p-[1rem] flex flex-col items-center">
      <div
        id="divWrapperDetail"
        className={`${backgroundGradient} transition  cursor-pointer rounded-t-xl text-white w-[35rem] relative p-[1rem] shadow-xl pb-[3rem]`}
      >
        <div className="flex gap-[1rem] items-center">
          <i
            className="fa-solid fa-arrow-left text-[3rem] cursor-pointer text-stone-100 hover:text-stone-300"
            title="back to home"
            onClick={() => navigate("/")}
          ></i>

          <h3 className="text-[2rem] font-semibold">
            {name && name.at(0).toUpperCase() + name.slice(1)}
          </h3>

          <div className="absolute top-[0] right-[1rem] flex gap-[1rem] items-center">
            <span className=" text-[2rem] text-stone-200">#{id}</span>

            <i
              className={` ${
                stateBookmarkedPokemons.includes(id) ? "fa-solid" : "fa-light"
              }  fa-bookmark text-[3rem] text-yellow-300`}
              onClick={() => toggleBookmark(id)}
            ></i>
          </div>
        </div>

        <div className="flex">
          <ul className="flex flex-col gap-[.5rem]">
            {types.map((type) => {
              return (
                <li
                  className={`${background} rounded-full text-center min-w-[5rem] p-[.5rem]`}
                  key={type}
                >
                  {type}
                </li>
              );
            })}
          </ul>
          <div className="h-[13rem] ">
            <img
              id="imgPokemon"
              src={pokemonImg}
              className="left-[5rem] object-contain w-[100%] h-[100%] scale-[1.2] relative bottom-[-4rem] z-[100] rotate-[5deg]"
            />
          </div>
        </div>
      </div>
      <Box
        className="relative top-[-1rem] bg-gradient-to-br from-stone-50 to-stone-200 rounded-t-3xl rounded-b-xl"
        sx={{ width: "35rem" }}
        id="wrapperTabs"
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            className="p-[1rem] pt-[2.3rem]"
            aria-label="basic tabs example"
            id="tabsNames"
          >
            <Tab label="About" {...a11yProps(0)} />
            <Tab label="Base Stats" {...a11yProps(1)} />
            <Tab label="Evolution" {...a11yProps(2)} />
            <Tab label="Moves" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <div>
            <table className="font-medium">
              <tbody>
                <tr className="flex gap-[.5rem]">
                  <td className="text-stone-400">Height</td>
                  <td className="text-stone-600">
                    {statePokemonObj?.height / 10} m
                  </td>
                </tr>
                <tr className="flex gap-[.5rem]">
                  <td className="text-stone-400">Weight</td>
                  <td className="text-stone-600">
                    {statePokemonObj?.weight / 10} kg
                  </td>
                </tr>
                <tr className="flex gap-[.5rem]">
                  <td className="text-stone-400">Abilities</td>
                  <td className="text-stone-600">
                    {abilities && abilities.join(", ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <table>
            <tbody className="flex flex-col gap-[.2rem] ">
              {statePokemonObj?.stats.map((statObj) => {
                return (
                  <tr
                    key={statObj?.stat?.name}
                    className="flex gap-[.5rem] items-center"
                  >
                    <td className="text-stone-400 min-w-[8rem] text-right">
                      {statObj?.stat?.name}
                    </td>
                    <td className="text-stone-600 min-w-[2rem] text-right">
                      {statObj?.base_stat}
                    </td>
                    <td className="min-w-[9rem]">
                      <BorderLinearProgress
                        value={statObj?.base_stat}
                        variant="determinate"
                        backgroundcolor={
                          greenStats.includes(statObj?.stat?.name)
                            ? "#059669"
                            : "#e11d48"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ul className="flex flex-col gap-[.5rem] items-center">
            {statePokemonEvolutionObj.length > 0 &&
              statePokemonEvolutionObj.map((obj) => {
                return (
                  <li key={obj.name} className="flex flex-col gap-[.5rem]">
                    {obj.level && (
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-[3rem] h-[3rem] rotate-[90deg] flex items-center bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-900 hover:to-sky-700  `}
                          style={{
                            clipPath:
                              "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
                          }}
                        >
                          <span className="rotate-[-90deg] font-medium text-white pt-[1.5rem] text-[1.3rem]">
                            {obj.level}
                          </span>
                        </div>
                      </div>
                    )}
                    <h4 className="text-[1.5rem] font-medium">{obj.name}</h4>
                    <img
                      src={obj.img}
                      className="w-[12rem] h-[12rem] cursor-pointer"
                      onClick={() => navigate(`/detail/${id}`)}
                    />
                  </li>
                );
              })}
          </ul>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <h3 className="text-[1.3rem] font-medium py-[.5rem]">
            Moves learnt by Level Up
          </h3>
          <table className="text-left">
            <thead>
              <tr className="border">
                <th className="w-[3rem] text-wrap pr-[1rem] pl-[1rem]">
                  Level learnt at
                </th>
                <th className="min-w-[7rem]">Move</th>
                <th className="min-w-[5rem]">Type</th>
                <th className="w-[3rem] text-wrap pr-[1rem]">Damage Class</th>
                <th className="min-w-[4rem] ">Power</th>
                <th className="min-w-[4rem] pr-[1rem]">Accuracy</th>
              </tr>
            </thead>
            <tbody className="p-[1rem]">
              {stateMovesLearntByLevelUp &&
                stateMovesLearntByLevelUp.map((obj, idx) => {
                  return (
                    obj?.move_learn_method?.name === "level-up" && (
                      <tr key={idx} className=" border p-[1rem]">
                        <td className="pl-[1rem]">{obj?.level_learned_at}</td>
                        <td>{obj?.move?.name}</td>
                        <td className="flex flex-col gap-[.1rem] py-[.5rem]">
                          <span
                            className={`${
                              backgrounds[obj?.moveObj?.type]
                            } w-[1rem] h-[1rem] rounded-full`}
                          ></span>
                          {obj?.moveObj?.type}
                        </td>
                        <td>{obj?.moveObj?.damage_class?.name}</td>
                        <td>
                          {obj?.moveObj?.power ? obj?.moveObj?.power : "-"}
                        </td>
                        <td>
                          {obj?.moveObj?.accuracy
                            ? obj?.moveObj?.accuracy
                            : "-"}
                        </td>
                      </tr>
                    )
                  );
                })}
            </tbody>
          </table>
          <br />
          {stateMovesLearntByTechnicalMachines.length > 0 && (
            <>
              <h3 className="text-[1.3rem] font-medium py-[.5rem]">
                Moves learnt by Technical Machines
              </h3>
              <table className="text-left">
                <thead>
                  <tr className="border">
                    <th className="w-[3rem] text-wrap pr-[1rem] pl-[1rem]">
                      Level learnt at
                    </th>
                    <th className="min-w-[7rem]">Move</th>
                    <th className="min-w-[5rem]">Type</th>
                    <th className="w-[3rem] text-wrap pr-[1rem]">
                      Damage Class
                    </th>
                    <th className="min-w-[4rem] ">Power</th>
                    <th className="min-w-[4rem] pr-[1rem]">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {stateMovesLearntByTechnicalMachines.map((obj, idx) => {
                    return (
                      <tr key={idx} className=" border p-[1rem]">
                        <td className="pl-[1rem]">{obj?.level_learned_at}</td>
                        <td>{obj?.move?.name}</td>
                        <td className="flex flex-col gap-[.1rem] py-[.5rem]">
                          <span
                            className={`${
                              backgrounds[obj?.moveObj?.type]
                            } w-[1rem] h-[1rem] rounded-full`}
                          ></span>
                          {obj?.moveObj?.type}
                        </td>
                        <td>{obj?.moveObj?.damage_class?.name}</td>
                        <td>
                          {obj?.moveObj?.power ? obj?.moveObj?.power : "-"}
                        </td>
                        <td>
                          {obj?.moveObj?.accuracy
                            ? obj?.moveObj?.accuracy
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </CustomTabPanel>
      </Box>
    </div>
  );
}
