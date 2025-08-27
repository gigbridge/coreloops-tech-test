import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from '@coreloops-repos/pokemons/pokemon.repository';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: jest.Mocked<PokemonRepository>;

  const mockPokemon = {
    id: 'pokemon-123',
    name: 'Pikachu',
    pokedexNumber: 25,
    abilities: [],
    types: [],
    moves: [
      {
        pokemonId: 'pokemon-123',
        moveId: 'move-123',
        level: 1,
        move: {
          id: 'move-123',
          name: 'Thunder Shock',
          accuracy: 100,
          damageClass: 'special',
          power: 40,
          pp: 30,
          typeId: 'type-electric',
          type: {
            id: 'type-electric',
            name: 'Electric',
            iconUrl: 'https://example.com/electric.png',
          },
        },
      },
    ],
  } as any;

  beforeEach(async () => {
    const mockRepository = {
      findMultiplePokemon: jest.fn(),
      getCount: jest.fn(),
      findPokemonById: jest.fn(),
      deletePokemon: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: PokemonRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repository = module.get(PokemonRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMultiplePokemon', () => {
    it('should return paginated pokemon list', async () => {
      const mockEntities = [mockPokemon];
      repository.findMultiplePokemon.mockResolvedValue({
        entities: mockEntities,
        hasNextPage: false,
      });
      repository.getCount.mockResolvedValue(1);

      const result = await service.findMultiplePokemon({ limit: 10 });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].name).toBe('Pikachu');
      expect(result.pageInfo.total).toBe(1);
      expect(repository.findMultiplePokemon).toHaveBeenCalledWith({
        limit: 10,
        includeMoves: false,
      });
    });

    it('should include moves when requested', async () => {
      const mockEntities = [mockPokemon];
      repository.findMultiplePokemon.mockResolvedValue({
        entities: mockEntities,
        hasNextPage: false,
      });
      repository.getCount.mockResolvedValue(1);

      await service.findMultiplePokemon({ limit: 10, includeMoves: true });

      expect(repository.findMultiplePokemon).toHaveBeenCalledWith({
        limit: 10,
        includeMoves: true,
      });
    });
  });

  describe('findPokemonWithMoves', () => {
    it('should return pokemon with moves', async () => {
      repository.findPokemonById.mockResolvedValue(mockPokemon);

      const result = await service.findPokemonWithMoves('pokemon-123');

      expect(result.name).toBe('Pikachu');
      expect(result.moves).toHaveLength(1);
      expect(result.moves![0].move.name).toBe('Thunder Shock');
      expect(repository.findPokemonById).toHaveBeenCalledWith('pokemon-123', true);
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      repository.findPokemonById.mockResolvedValue(null);

      await expect(service.findPokemonWithMoves('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle repository errors', async () => {
      repository.findPokemonById.mockRejectedValue(new Error('Database error'));

      await expect(service.findPokemonWithMoves('pokemon-123')).rejects.toThrow(
        'Failed to fetch Pokemon details'
      );
    });
  });

  describe('deletePokemon', () => {
    it('should delete pokemon successfully', async () => {
      repository.deletePokemon.mockResolvedValue();

      await expect(service.deletePokemon('pokemon-123')).resolves.not.toThrow();
      expect(repository.deletePokemon).toHaveBeenCalledWith('pokemon-123');
    });

    it('should propagate NotFoundException from repository', async () => {
      repository.deletePokemon.mockRejectedValue(
        new NotFoundException('Pokemon not found')
      );

      await expect(service.deletePokemon('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should propagate ForbiddenException from repository', async () => {
      repository.deletePokemon.mockRejectedValue(
        new ForbiddenException('Only admin users can delete Pokemon')
      );

      await expect(service.deletePokemon('pokemon-123')).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should handle other repository errors', async () => {
      repository.deletePokemon.mockRejectedValue(new Error('Database error'));

      await expect(service.deletePokemon('pokemon-123')).rejects.toThrow(
        'Failed to delete Pokemon'
      );
    });
  });
});