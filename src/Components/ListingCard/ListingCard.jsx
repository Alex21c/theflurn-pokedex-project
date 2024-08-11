import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react";
import { backgroundGradients } from "../../CssStylesTailwind/CssStylesTailwind";
import { backgrounds } from "../../CssStylesTailwind/CssStylesTailwind";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ pokemonObj = null, navigate = null }) {
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

    const id = pokemonObj?.id;
    const backgroundGradient =
      backgroundGradients[types?.at(0)] || backgroundGradients.default;
    const background = backgrounds[types?.at(0)] || backgrounds.default;

    return (
      <div
        className={`${backgroundGradient} transition  cursor-pointer rounded-xl text-white w-[20rem] relative p-[1rem] shadow-xl`}
        onClick={() => {
          navigate && navigate(`/detail/${id}`);
        }}
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
