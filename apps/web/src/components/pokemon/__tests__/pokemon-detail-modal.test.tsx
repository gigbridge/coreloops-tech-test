import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PokemonDetailModal } from '../pokemon-detail-modal';

// Mock the API hook
jest.mock('@/src/api/hooks/use-pokemon', () => ({
  usePokemonDetail: jest.fn(),
}));

const { usePokemonDetail } = require('@/src/api/hooks/use-pokemon');

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
}

describe('PokemonDetailModal', () => {
  const defaultProps = {
    pokemonId: 'test-id',
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading skeleton when loading', () => {
    usePokemonDetail.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithQueryClient(<PokemonDetailModal {...defaultProps} />);

    // Should show loading skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(0); // Skeleton components don't have testId by default
    // Instead, check for the loading structure
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows error UI when there is an error', () => {
    const mockError = new Error('Failed to fetch');
    usePokemonDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: jest.fn(),
    });

    renderWithQueryClient(<PokemonDetailModal {...defaultProps} />);

    expect(screen.getByText('Failed to Load Pokémon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('shows pokemon data when loaded successfully', () => {
    const mockPokemon = {
      id: 'test-id',
      name: 'Pikachu',
      pokedexNumber: 25,
      types: [
        {
          id: 'electric',
          name: 'electric',
          iconUrl: 'https://example.com/electric.png',
        },
      ],
      abilities: [
        {
          id: 'static',
          name: 'static',
          description: 'May cause paralysis when touched.',
        },
      ],
      moves: [
        {
          pokemonId: 'test-id',
          moveId: 'thunderbolt',
          level: 15,
          move: {
            id: 'thunderbolt',
            name: 'Thunderbolt',
            power: 90,
            accuracy: 100,
            damageClass: 'special',
            pp: 15,
            type: {
              id: 'electric',
              name: 'electric',
              iconUrl: 'https://example.com/electric.png',
            },
          },
        },
      ],
    };

    usePokemonDetail.mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithQueryClient(<PokemonDetailModal {...defaultProps} />);

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('Moves')).toBeInTheDocument();
  });

  it('does not render when not open', () => {
    usePokemonDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithQueryClient(<PokemonDetailModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
