import React from 'react';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  // new piece of state: handle search
  const [search, setSearch] = React.useState('');
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemons();

  // once we have a search query, filter out the data array client-side
  const filteredData = data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // useGetPokemons already returns loading status, leverage here
  if (loading) {
    return (
      <div className={classes.root}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.root}>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul>
        {filteredData?.map((d) => (
          <li key={d.id}>
            {d.id} {d.name} {d.types?.[0]} {d.types?.[1]}{' '}
            <img src={d.sprite} alt="" width={30} height={30} />
          </li>
        ))}
        {!filteredData.length && <h1>No Pokemon found!</h1>}
      </ul>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    li: theme.li,
  },
}));
