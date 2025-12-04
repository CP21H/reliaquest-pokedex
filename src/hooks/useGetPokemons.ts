import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  weight: string;
  height: string;
  stats?: string[];
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (/* search?: string */): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: '', // `.*${search}.*`,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          // pokemontypes is a string[] -> requires its own mapping
          types: p.pokemontypes.map((typeEntry: any) => typeEntry.type.typenames?.[0]?.name),
          // pokemonsprites is an array, requires indexing
          sprite: p.pokemonsprites?.[0].sprites,
        }),
      ) ?? [],
    loading,
    error,
  };
};

// Detail-oriented variation oof useGetPokemons, using GET_POKEMON_DETAILS query
export const useGetPokemonDetails = (
  id: string,
): {
  data?: PokemonDetail;
  loading: boolean;
  error: any;
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id },
    skip: !id, // prevents running query when id is empty/undefined
  });

  const pokemon = data?.pokemon?.[0];

  // early return if data does not return a pokemon
  if (!pokemon) {
    return { data: undefined, loading, error };
  }

  return {
    data: {
      id: String(pokemon.id),
      name: pokemon.pokemonspecy?.pokemonspeciesnames?.[0]?.name,
      types: pokemon.pokemontypes?.map((t: any) => t.type?.typenames?.[0]?.name),
      sprite: pokemon.pokemonsprites?.[0]?.sprites,
      weight: pokemon.weight?.toString(),
      height: pokemon.height?.toString(),
      stats: pokemon.pokemonstats?.map((s: any) => `${s.base_stat}`),
    },
    loading,
    error,
  };
};
