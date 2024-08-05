import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react";

export default function ListingCard({ pokemonObj = null }) {
  try {
    if (!pokemonObj) {
      throw new Error(
        "ERROR: Pokemon Obj Data is Missing inside component ListingCard"
      );
    }
    const name = pokemonObj?.name;
    const types = [];
    pokemonObj?.types &&
      pokemonObj?.types.length > 0 &&
      pokemonObj?.types.forEach((obj) => {
        types.push(obj?.type?.name);
      });
    const pokemonImg =
      pokemonObj?.sprites?.other["official-artwork"]?.front_default;
    const backgroundGradients = {
      default:
        "bg-gradient-to-br from-red-200 to-red-400 hover:from-amber-400 hover:to-amber-200",
      normal: `bg-gradient-to-br from-slate-400 to-slate-600 hover:from-amber-600 hover:to-amber-400`,
      steel: `bg-gradient-to-br from-slate-400 to-slate-600 hover:from-amber-600 hover:to-amber-400`,
      poison: `bg-gradient-to-br from-rose-700 to-rose-900 hover:from-amber-900 hover:to-amber-700`,
      rock: `bg-gradient-to-br from-stone-400 to-stone-600 hover:from-amber-600 hover:to-amber-400`,
      bug: `bg-gradient-to-br from-green-700 to-green-900 hover:from-green-900 hover:to-green-700`,
      grass: `bg-gradient-to-br from-green-700 to-green-900 hover:from-green-900 hover:to-green-700`,
      fairy: `bg-gradient-to-br from-green-600 to-green-800 hover:from-green-800 hover:to-green-600`,
      unknown: `bg-gradient-to-br from-green-500 to-green-700 hover:from-green-700 hover:to-green-500`,
      fire: `bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-500`,
      dragon: `bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-700 hover:to-amber-500`,
      fighting: `bg-gradient-to-br from-fuchsia-700 to-fuchsia-900 hover:from-fuchsia-900 hover:to-fuchsia-700`,
      ground: `bg-gradient-to-br from-emerald-700 to-emerald-900 hover:from-emerald-900 hover:to-emerald-700`,
      flying: `bg-gradient-to-br from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500`,
      water: `bg-gradient-to-br from-sky-700 to-sky-900 hover:from-sky-900 hover:to-sky-700`,
      ice: `bg-gradient-to-br from-sky-700 to-sky-900 hover:from-sky-900 hover:to-sky-700`,
      electric: `bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-800 hover:to-indigo-600`,
      psychic: `bg-gradient-to-br from-purple-700 to-purple-900 hover:from-purple-900 hover:to-purple-700`,
      ghost: `bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-900 hover:to-gray-700`,
      dark: `bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-900 hover:to-gray-700`,
      shadow: `bg-gradient-to-br from-red-400 to-gray-600 hover:from-gray-600 hover:to-gray-400`,
    };
    const backgrounds = {
      default: "bg-red-200",
      normal: `bg-slate-400`,
      steel: `bg-slate-400`,
      poison: `bg-rose-700`,
      rock: `bg-stone-400`,
      bug: `bg-green-700`,
      grass: `bg-green-700`,
      fairy: `bg-green-600`,
      unknown: `bg-green-500`,
      fire: `bg-amber-500`,
      dragon: `bg-amber-700`,
      fighting: `bg-fuchsia-700`,
      ground: `bg-emerald-700`,
      flying: `bg-sky-500`,
      water: `bg-sky-700`,
      ice: `bg-sky-700`,
      electric: `bg-indigo-600`,
      psychic: `bg-purple-700`,
      ghost: `bg-gray-700`,
      dark: `bg-gray-700`,
      shadow: `bg-red-400`,
    };
    const id = pokemonObj?.id;
    const backgroundGradient =
      backgroundGradients[types?.at(0)] || backgroundGradients.default;
    const background = backgrounds[types?.at(0)] || backgrounds.default;

    console.log(name, types, pokemonImg, backgroundGradient);

    const typeIcons = {
      dragon: `<i title='dragon' class="fa-solid fa-dragon"></i>`,
      flying: `<i title='flying' class="fa-solid fa-dove"></i>`,
      fire: `<i title='fire' class="fa-sharp fa-solid fa-fire"></i>`,
      grass: `<i title='grass' class="fa-solid fa-tree-palm"></i>`,
      ground: `<i title='ground' class="fa-regular fa-mountains"></i>`,
      rock: `<i title='rock' class="fa-sharp fa-solid fa-gem"></i>`,
      water: `<i title='water' class="fa-solid fa-droplet"></i>`,
      ice: `<i title='ice' class="fa-solid fa-snowflakes"></i>`,
      bug: `<i title='bug' class="fa-sharp fa-solid fa-bug"></i>`,
      fighting: `<i title='fighting' class="fa-solid fa-boxing-glove"></i>`,
      poison: `<i title='poison' class="fa-sharp fa-solid fa-flask-round-poison"></i>`,
      ghost: `<i title='ghost' class="fa-sharp fa-solid fa-ghost"></i>`,
      steel: `<i title='steel' class="fa-sharp fa-solid fa-hammer"></i>`,
      electric: `<i title='electric' class="fa-sharp fa-solid fa-bolt"></i>`,
      psychic: `<i title='psychic' class="fa-solid fa-head-side-brain"></i>`,
      dark: `<i title='dark' class="fa-solid fa-moon-cloud"></i>`,
      shadow: `<i title='shadow' class="fa-solid fa-eclipse"></i>`,
      fairy: `<i title='fairy' class="fa-solid fa-clouds"></i>`,
      normal: `<i title='normal' class="fa-sharp fa-regular fa-circle"></i>`,
      unknown: `<i title='unknown' class="fa-solid fa-square-question"></i>`,
    };

    return (
      <div
        className={`${backgroundGradient} transition  cursor-pointer rounded-xl text-white w-[20rem] relative p-[1rem] shadow-xl`}
      >
        <h3 className="text-[2rem] font-semibold">
          {name && name.at(0).toUpperCase() + name.slice(1)}
        </h3>
        <span className="absolute top-[0] right-[1rem] text-[2rem] text-stone-200">
          #{id}
        </span>
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
          <div className="w-[15rem] h-[10rem] ">
            <img
              src={pokemonImg}
              className=" object-contain w-[100%] h-[100%] scale-[1.2]"
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return console.error("Alex21C-Error: ", error.message);
  }
}
