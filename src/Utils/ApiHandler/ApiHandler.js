export const fetchPokemon = async (pokemonURL) => {
  try {
    if (!pokemonURL) {
      throw new Error(
        "ERROR: Pokemon URL Missing inside method fetchPokemon(), returning !"
      );
    }

    let response = await fetch(pokemonURL);
    if (response) {
      response = await response.json();
      console.log(response);
      return response;
    } else {
      throw new Error("No reponse");
    }
  } catch (error) {
    console.error("Alex21C-ERROR: ");
    console.log("hi there");
  }
};
