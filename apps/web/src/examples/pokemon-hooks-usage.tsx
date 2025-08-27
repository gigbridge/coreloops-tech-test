/**
 * Example usage of the new Pokemon API hooks
 * This file demonstrates how to use the hooks created in task 13
 */

import { usePokemonDelete, usePokemonDetail } from '@/src/api/hooks/use-pokemon';
import { Button } from '@/src/components/ui/button';
import { usePokemonWithMoves } from '@/src/hooks/use-pokemon-with-moves';

// Example 1: Using usePokemonDetail for fetching individual pokemon with moves
export function PokemonDetailExample({ pokemonId }: { pokemonId: string | null }) {
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(pokemonId);

  if (isLoading) return <div>Loading pokemon details...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!pokemon) return <div>No pokemon found</div>;

  return (
    <div>
      <h2>{pokemon.name}</h2>
      <p>Pokedex Number: {pokemon.pokedexNumber}</p>
      <div>
        <h3>Moves ({pokemon.moves?.length || 0})</h3>
        {pokemon.moves?.map(pokemonMove => (
          <div key={pokemonMove.moveId}>
            {pokemonMove.move.name} (Level {pokemonMove.level})
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 2: Using usePokemonDelete for deleting pokemon with optimistic updates
export function PokemonDeleteExample({ pokemonId }: { pokemonId: string }) {
  const deleteMutation = usePokemonDelete();

  const handleDelete = () => {
    deleteMutation.mutate(pokemonId);
  };

  return (
    <div>
      <Button onClick={handleDelete} disabled={deleteMutation.isPending} variant="destructive">
        {deleteMutation.isPending ? 'Deleting...' : 'Delete Pokemon'}
      </Button>

      {deleteMutation.isError && <div className="mt-2 text-red-500">Error: {deleteMutation.error?.message}</div>}

      {deleteMutation.isSuccess && <div className="mt-2 text-green-500">Pokemon deleted successfully!</div>}
    </div>
  );
}

// Example 3: Using usePokemonWithMoves (convenience hook)
export function PokemonMovesExample({ pokemonId }: { pokemonId: string | null }) {
  const { pokemon, moves, isLoading, isError, error } = usePokemonWithMoves(pokemonId);

  if (isLoading) return <div>Loading moves...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h3>Moves for {pokemon?.name}</h3>
      <div>Total moves: {moves.length}</div>
      {moves.map(pokemonMove => (
        <div key={pokemonMove.moveId} className="m-1 border p-2">
          <strong>{pokemonMove.move.name}</strong>
          <div>Level: {pokemonMove.level}</div>
          <div>Power: {pokemonMove.move.power || 'N/A'}</div>
          <div>Accuracy: {pokemonMove.move.accuracy || 'N/A'}</div>
          <div>Type: {pokemonMove.move.type.name}</div>
        </div>
      ))}
    </div>
  );
}
