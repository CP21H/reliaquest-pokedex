import React from 'react';
import { tss } from '../tss';
import { Pokemon, useGetPokemons, useGetPokemonDetails } from 'src/hooks/useGetPokemons';
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

  // Routing
  const { id } = useParams(); // allows access to :id in dynamic routes
  const navigate = useNavigate();

  // State/Data Collection for GET_POKEMON_DETAILS -- must be after selectedPokemon
  const {
    data: pokemonDetail,
    loading: detailLoading,
    error: detailError,
  } = useGetPokemonDetails(selectedPokemon?.id ?? '');

  // Modal Handlers
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
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ol>
        {filteredData?.map((d) => (
          <li key={d.id}>
            {/* Deep-link route */}
            <Link to={`/list/pokemon/${d.id}`}>
              {/* Ant-design Modal Leveraged */}
              <Button onClick={() => showModal(d)} size="large" type="primary" color="red">
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
        title={pokemonDetail?.name}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {detailLoading && <p>Loading details...</p>}
        {!detailLoading && detailError && <p>Error loading details: {detailError.message}</p>}
        {!detailLoading && !detailError && selectedPokemon && (
          <div>
            <img src={selectedPokemon?.sprite} alt="" width={96} height={96} />
            <p>
              <strong>Type:</strong> {pokemonDetail?.types?.[0]} {pokemonDetail?.types?.[1]}
            </p>
            <p>
              <strong>HP:</strong> {pokemonDetail?.stats?.[0]}
            </p>
            <p>
              <strong>Attack:</strong> {pokemonDetail?.stats?.[1]}
            </p>
            <p>
              <strong>Defense:</strong> {pokemonDetail?.stats?.[2]}
            </p>
            <p>
              <strong>Special Attack:</strong> {pokemonDetail?.stats?.[3]}
            </p>
            <p>
              <strong>Special Defense:</strong> {pokemonDetail?.stats?.[4]}
            </p>
            <p>
              <strong>Speed:</strong> {pokemonDetail?.stats?.[5]}
            </p>
            <p>
              <strong>Weight:</strong> {pokemonDetail?.weight}
            </p>
            <p>
              <strong>Height:</strong> {pokemonDetail?.height}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    li: theme.li,
    input: theme.input,
  },
}));
