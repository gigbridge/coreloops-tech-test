import { PokemonMoveDto, ViewMoveDto, ViewTypeDto } from '@coreloops/shared-types';
import { fireEvent, render, screen } from '@testing-library/react';
import { MovesTable } from './moves-table';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: unknown) => <img src={src} alt={alt} {...props} />,
}));

const mockType: ViewTypeDto = {
  id: 'type-1',
  name: 'fire',
  iconUrl: 'https://example.com/fire.png',
};

const mockMove1: ViewMoveDto = {
  id: 'move-1',
  name: 'Ember',
  accuracy: 100,
  damageClass: 'special',
  power: 40,
  pp: 25,
  typeId: 'type-1',
  type: mockType,
};

const mockMove2: ViewMoveDto = {
  id: 'move-2',
  name: 'Flamethrower',
  accuracy: 100,
  damageClass: 'special',
  power: 90,
  pp: 15,
  typeId: 'type-1',
  type: mockType,
};

const mockPokemonMoves: PokemonMoveDto[] = [
  {
    pokemonId: 'pokemon-1',
    moveId: 'move-1',
    level: 7,
    move: mockMove1,
  },
  {
    pokemonId: 'pokemon-1',
    moveId: 'move-2',
    level: 15,
    move: mockMove2,
  },
];

describe('MovesTable', () => {
  it('renders moves table with correct data', () => {
    render(<MovesTable moves={mockPokemonMoves} />);

    expect(screen.getByText('Ember')).toBeTruthy();
    expect(screen.getByText('Flamethrower')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getAllByText('15')).toHaveLength(2); // Level 15 and PP 15
    expect(screen.getByText('40')).toBeTruthy();
    expect(screen.getByText('90')).toBeTruthy();
  });

  it('sorts by level by default (ascending)', () => {
    render(<MovesTable moves={mockPokemonMoves} />);

    const rows = screen.getAllByRole('row');
    // Skip header row, check data rows
    expect(rows[1].textContent).toContain('Ember'); // Level 7 should be first
    expect(rows[2].textContent).toContain('Flamethrower'); // Level 15 should be second
  });

  it('toggles sort order when clicking level header', () => {
    render(<MovesTable moves={mockPokemonMoves} />);

    const levelButton = screen.getByRole('button', { name: /level/i });

    // Click to sort descending
    fireEvent.click(levelButton);

    const rows = screen.getAllByRole('row');
    // After clicking, level 15 should be first (descending)
    expect(rows[1].textContent).toContain('Flamethrower');
    expect(rows[2].textContent).toContain('Ember');
  });

  it('sorts by power when clicking power header', () => {
    render(<MovesTable moves={mockPokemonMoves} />);

    const powerButton = screen.getByRole('button', { name: /power/i });
    fireEvent.click(powerButton);

    const rows = screen.getAllByRole('row');
    // Should sort by power ascending (40, then 90)
    expect(rows[1].textContent).toContain('Ember'); // Power 40
    expect(rows[2].textContent).toContain('Flamethrower'); // Power 90
  });

  it('displays empty state when no moves provided', () => {
    render(<MovesTable moves={[]} />);

    expect(screen.getByText('No moves available for this Pokémon.')).toBeTruthy();
  });

  it('handles null power values correctly', () => {
    const moveWithNullPower: ViewMoveDto = {
      ...mockMove1,
      power: null,
    };

    const pokemonMoveWithNullPower: PokemonMoveDto = {
      pokemonId: 'pokemon-1',
      moveId: 'move-3',
      level: 1,
      move: moveWithNullPower,
    };

    render(<MovesTable moves={[pokemonMoveWithNullPower]} />);

    expect(screen.getByText('—')).toBeTruthy(); // Should display em dash for null power
  });
});
