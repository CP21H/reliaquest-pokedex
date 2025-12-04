import React from 'react';
import { tss } from '../tss';
import { Pokemon, useGetPokemons } from 'src/hooks/useGetPokemons';
import { Button, Modal, Flex } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';

export const PokemonListPage = () => {
  // Original Pieces of State
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemons();

  // New piece of state: handle search, modal, routing
  const [search, setSearch] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon | null>(null);
  const { id } = useParams(); // allows access to :id in dynamic routes
  const navigate = useNavigate();

  const showModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
    navigate('/list');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
    navigate('/list');
  };

  // Support for deep-linking
  React.useEffect(() => {
    if (!id || !data.length) return;

    const urlPokemon = data.find((p) => p.id === id);
    if (urlPokemon) {
      setSelectedPokemon(urlPokemon);
      setIsModalOpen(true);
    }
  }, [id, data]);

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
      <ol>
        {filteredData?.map((d) => (
          <li key={d.id}>
            <Link to={`/list/pokemon/${d.id}`}>
              <Button onClick={() => showModal(d)} size="large">
                <Flex gap="middle">
                  <img src={d.sprite} alt="" width={30} height={30} /> {d.name}
                </Flex>
              </Button>
            </Link>
          </li>
        ))}
        {!filteredData.length && <h1>No Pokemon found!</h1>}
      </ol>
      <Modal
        title={selectedPokemon?.name}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <img src={selectedPokemon?.sprite} alt="" width={50} height={50} />
          <p>
            <strong>Type:</strong> {selectedPokemon?.types?.[0]} {selectedPokemon?.types?.[1]}
          </p>
          <p>Total:</p>
          <p>HP: Attack: Defense: Special-Attack: Special-Defense: Speed:</p>
          <p>Weight:</p>
          <p>Height:</p>
        </div>
      </Modal>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    li: theme.li,
  },
}));
