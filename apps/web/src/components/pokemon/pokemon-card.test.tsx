import { ViewPokemonDto } from '@coreloops/shared-types';
import { fireEvent, render, screen } from '@testing-library/react';
import { PokemonCard } from './pokemon-card';

const mockPokemon: ViewPokemonDto = {
  id: '1',
  name: 'Pikachu',
  pokedexNumber: 25,
  abilities: [],
  types: [
    {
      id: '1',
      name: 'Electric',
      iconUrl: 'https://example.com/electric.png',
    },
  ],
};

describe('PokemonCard', () => {
  const mockOnView = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnView.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} isAdmin={false} onView={mockOnView} onDelete={mockOnDelete} />);

    expect(screen.getByText('#025')).toBeTruthy();
    expect(screen.getByText('Pikachu')).toBeTruthy();
    expect(screen.getByText('View')).toBeTruthy();
  });

  it('shows delete button when user is admin', () => {
    render(<PokemonCard pokemon={mockPokemon} isAdmin={true} onView={mockOnView} onDelete={mockOnDelete} />);

    expect(screen.getByRole('button', { name: /delete pokemon/i })).toBeTruthy();
  });

  it('hides delete button when user is not admin', () => {
    render(<PokemonCard pokemon={mockPokemon} isAdmin={false} onView={mockOnView} onDelete={mockOnDelete} />);

    expect(screen.queryByRole('button', { name: /delete pokemon/i })).toBeNull();
  });

  it('calls onView when view button is clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} isAdmin={false} onView={mockOnView} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('View'));
    expect(mockOnView).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} isAdmin={true} onView={mockOnView} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete pokemon/i }));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
