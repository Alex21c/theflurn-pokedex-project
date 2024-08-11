export const fetchPokemon = async (pokemonURL) => {
  try {
    if (!pokemonURL) {
      throw new Error(
        "ERROR: Pokemon URL Missing inside method fetchPokemon(), returning !"
      );
    }

    let response = await fetch(pokemonURL);
    if (response.status === 404) {
      throw new Error("Not Found !");
    } else if (response) {
      response = await response.json();

      return response;
    } else {
      throw new Error("No reponse");
    }
  } catch (error) {
    console.warn("Alex21C-ERROR: " + error.message);
    return null;
  }
};

export const fetchPokemonById = async (pokemonID) => {
  try {
    if (!pokemonID) {
      throw new Error(
        "ERROR: Pokemon ID Missing inside method fetchPokemonById(), returning !"
      );
    }
    const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;
    let response = await fetch(pokemonURL);
    if (response.status === 404) {
      throw new Error("Not Found !");
    } else if (response) {
      response = await response.json();

      return response;
    } else {
      throw new Error("No reponse");
    }
  } catch (error) {
    console.warn("Alex21C-ERROR: " + error.message);
    return null;
  }
};

export const fetchPokemonByName = async (pokemonName) => {
  try {
    if (!pokemonName) {
      throw new Error(
        "ERROR: pokemonName Missing inside method fetchPokemonByName(), returning !"
      );
    }
    const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(pokemonURL);
    if (response.status === 404) {
      throw new Error("Not Found !");
    } else if (response) {
      response = await response.json();

      return response;
    } else {
      throw new Error("No reponse");
    }
  } catch (error) {
    console.warn("Alex21C-ERROR: " + error.message);
    return null;
  }
};

export const createMoveObj = async (moveURL) => {
  try {
    if (!moveURL) {
      throw new Error(
        "ERROR: moveURL Missing inside method createMoveObj(), returning !"
      );
    }

    let response = await fetch(moveURL);
    if (response.status === 404) {
      throw new Error("Not Found !");
    } else if (response) {
      response = await response.json();
      return {
        type: response?.type?.name,
        damage_class: response?.damage_class,
        power: response?.power,
        accuracy: response?.accuracy,
      };
    } else {
      throw new Error("No reponse");
    }
  } catch (error) {
    console.warn("Alex21C-ERROR: " + error.message);
    return null;
  }
};

export const createPokemonEvolutionObj = async (pokemonId = null) => {
  try {
    if (!pokemonId) {
      throw new Error(
        "ERROR: pokemonId Missing inside method createPokemonEvolutionObj(), returning !"
      );
    }

    const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
    // make api call and then get the evolution chain url
    let response = await fetch(speciesURL);
    if (response) {
      response = await response.json();
    } else {
      return null;
    }

    if (response.status === 404) {
      throw new Error("Not Found !");
    } else if (response?.evolution_chain?.url) {
      const evolutionURL = response?.evolution_chain?.url;
      response = await fetch(evolutionURL);
      if (response) {
        response = await response.json();
        return response;
      } else {
        throw new Error("No reponse");
      }
    } else {
      return null;
    }
  } catch (error) {
    console.warn("Alex21C-ERROR: " + error.message);
    return null;
  }
};
