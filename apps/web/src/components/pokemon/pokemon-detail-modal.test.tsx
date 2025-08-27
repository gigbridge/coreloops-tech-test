import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PokemonDetailModal } from './pokemon-detail-modal';

// Mock the API hook
jest.mock('@/src/api/hooks/use-pokemon', () => ({
  usePokemonDetail: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockUsePokemonDetail = require('@/src/api/hooks/use-pokemon').usePokemonDetail;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

const mockPokemon = {
  id: '1',
  name: 'Bulbasaur',
  pokedexNumber: 1,
  types: [
    {
      id: '1',
      name: 'grass',
      iconUrl: 'https://example.com/grass.png',
    },
    {
      id: '2',
      name: 'poison',
      iconUrl: 'https://example.com/poison.png',
    },
  ],
  abilities: [
    {
      id: '1',
      name: 'overgrow',
      description: 'Powers up Grass-type moves when the Pokémon is in trouble.',
    },
  ],
  moves: [
    {
      pokemonId: '1',
      moveId: '1',
      level: 1,
      move: {
        id: '1',
        name: 'tackle',
        power: 40,
        accuracy: 100,
        pp: 35,
        damageClass: 'physical',
        typeId: '1',
        type: {
          id: '1',
          name: 'normal',
          iconUrl: 'https://example.com/normal.png',
        },
      },
    },
  ],
};

describe('PokemonDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    mockUsePokemonDetail.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithQueryClient(<PokemonDetailModal pokemonId="1" isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Check for skeleton loading elements
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    mockUsePokemonDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithQueryClient(<PokemonDetailModal pokemonId="1" isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load Pokémon details. Please try again.')).toBeInTheDocument();
  });

  it('renders pokemon details when data is loaded', () => {
    mockUsePokemonDetail.mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<PokemonDetailModal pokemonId="1" isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('overgrow')).toBeInTheDocument();
    expect(screen.getByText('Moves')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    mockUsePokemonDetail.mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<PokemonDetailModal pokemonId="1" isOpen={false} onClose={jest.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows empty state when pokemon has no moves', () => {
    const pokemonWithoutMoves = {
      ...mockPokemon,
      moves: [],
    };

    mockUsePokemonDetail.mockReturnValue({
      data: pokemonWithoutMoves,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<PokemonDetailModal pokemonId="1" isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('No moves available for this Pokémon.')).toBeInTheDocument();
  });
});
