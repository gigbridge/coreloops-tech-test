import { UserStore } from '@coreloops-api/shared/contexts';
import { DrizzleProvider } from '@coreloops/data-access-layer';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { PokemonRepository } from './pokemon.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PokemonRepository', () => {
  let repository: PokemonRepository;
  let mockDrizzleProvider: jest.Mocked<DrizzleProvider>;
  let mockClsService: jest.Mocked<ClsService<UserStore>>;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    isAdmin: false,
  };

  const mockAdminUser = {
    id: 'admin-123',
    username: 'adminuser',
    isAdmin: true,
  };

  const mockPokemon = {
    id: 'pokemon-123',
    name: 'Pikachu',
    pokedexNumber: 25,
    types: [
      {
        pokemonId: 'pokemon-123',
        typeId: 'type-electric',
        type: {
          id: 'type-electric',
          name: 'Electric',
        },
      },
    ],
    abilities: [
      {
        pokemonId: 'pokemon-123',
        abilityId: 'ability-static',
        ability: {
          id: 'ability-static',
          name: 'Static',
        },
      },
    ],
    moves: [
      {
        pokemonId: 'pokemon-123',
        moveId: 'move-thunderbolt',
        level: 15,
        move: {
          id: 'move-thunderbolt',
          name: 'Thunderbolt',
          accuracy: 100,
          damageClass: 'special',
          power: 90,
          pp: 15,
          typeId: 'type-electric',
          type: {
            id: 'type-electric',
            name: 'Electric',
          },
        },
      },
    ],
  };

  beforeEach(async () => {
    const mockPokemonEntityQuery = {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    };

    const mockDb = {
      query: {
        pokemonEntity: mockPokemonEntityQuery,
      },
      delete: jest.fn().mockReturnThis(),
    };

    mockDrizzleProvider = {
      db: mockDb,
    } as any;

    mockClsService = {
      get: jest.fn().mockReturnValue(mockUser),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonRepository,
        {
          provide: DrizzleProvider,
          useValue: mockDrizzleProvider,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    repository = module.get<PokemonRepository>(PokemonRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMultiplePokemon', () => {
    it('should return pokemon without moves by default', async () => {
      const expectedPokemon = [mockPokemon];
      (mockDrizzleProvider.db.query.pokemonEntity.findMany as jest.Mock).mockResolvedValue(expectedPokemon);

      const result = await repository.findMultiplePokemon({ limit: 10 });

      expect(mockDrizzleProvider.db.query.pokemonEntity.findMany as jest.Mock).toHaveBeenCalledWith({
        where: undefined,
        orderBy: expect.any(Array),
        limit: 11,
        with: {
          abilities: {
            with: {
              ability: true,
            },
          },
          types: {
            with: {
              type: true,
            },
          },
        },
      });
      expect(result.entities).toEqual(expectedPokemon);
      expect(result.hasNextPage).toBe(false);
    });

    it('should return pokemon with moves when includeMoves is true', async () => {
      const expectedPokemon = [mockPokemon];
      (mockDrizzleProvider.db.query.pokemonEntity.findMany as jest.Mock).mockResolvedValue(expectedPokemon);

      const result = await repository.findMultiplePokemon({ limit: 10, includeMoves: true });

      expect(mockDrizzleProvider.db.query.pokemonEntity.findMany as jest.Mock).toHaveBeenCalledWith({
        where: undefined,
        orderBy: expect.any(Array),
        limit: 11,
        with: {
          abilities: {
            with: {
              ability: true,
            },
          },
          types: {
            with: {
              type: true,
            },
          },
          moves: {
            with: {
              move: {
                with: {
                  type: true,
                },
              },
            },
            orderBy: expect.any(Function),
          },
        },
      });
      expect(result.entities).toEqual(expectedPokemon);
    });

    it('should handle pagination correctly', async () => {
      const manyPokemon = Array(11).fill(mockPokemon);
      (mockDrizzleProvider.db.query.pokemonEntity.findMany as jest.Mock).mockResolvedValue(manyPokemon);

      const result = await repository.findMultiplePokemon({ limit: 10 });

      expect(result.hasNextPage).toBe(true);
      expect(result.entities).toHaveLength(10);
    });
  });

  describe('findPokemonById', () => {
    it('should return pokemon without moves by default', async () => {
      const pokemonId = 'pokemon-123';
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await repository.findPokemonById(pokemonId);

      expect(mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          abilities: {
            with: {
              ability: true,
            },
          },
          types: {
            with: {
              type: true,
            },
          },
        },
      });
      expect(result).toEqual(mockPokemon);
    });

    it('should return pokemon with moves when includeMoves is true', async () => {
      const pokemonId = 'pokemon-123';
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await repository.findPokemonById(pokemonId, true);

      expect(mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          abilities: {
            with: {
              ability: true,
            },
          },
          types: {
            with: {
              type: true,
            },
          },
          moves: {
            with: {
              move: {
                with: {
                  type: true,
                },
              },
            },
            orderBy: expect.any(Function),
          },
        },
      });
      expect(result).toEqual(mockPokemon);
    });

    it('should return null when pokemon not found', async () => {
      const pokemonId = 'non-existent-pokemon';
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.findPokemonById(pokemonId);

      expect(result).toBeNull();
    });
  });

  describe('deletePokemon', () => {
    beforeEach(() => {
      // Mock the delete method chain
      const mockWhere = jest.fn().mockResolvedValue(undefined);
      (mockDrizzleProvider.db.delete as jest.Mock).mockReturnValue({
        where: mockWhere,
      });
    });

    it('should delete pokemon when user is admin', async () => {
      const pokemonId = 'pokemon-123';
      mockClsService.get.mockReturnValue(mockAdminUser);
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(mockPokemon);

      await repository.deletePokemon(pokemonId);

      expect(mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(mockDrizzleProvider.db.delete).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not admin', async () => {
      const pokemonId = 'pokemon-123';
      mockClsService.get.mockReturnValue(mockUser);

      await expect(repository.deletePokemon(pokemonId)).rejects.toThrow(ForbiddenException);
      expect(mockDrizzleProvider.db.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const pokemonId = 'non-existent-pokemon';
      mockClsService.get.mockReturnValue(mockAdminUser);
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(undefined);

      await expect(repository.deletePokemon(pokemonId)).rejects.toThrow(NotFoundException);
      expect(mockDrizzleProvider.db.delete).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const pokemonId = 'pokemon-123';
      mockClsService.get.mockReturnValue(mockAdminUser);
      (mockDrizzleProvider.db.query.pokemonEntity.findFirst as jest.Mock).mockResolvedValue(mockPokemon);
      
      const mockWhere = jest.fn().mockRejectedValue(new Error('Database error'));
      (mockDrizzleProvider.db.delete as jest.Mock).mockReturnValue({
        where: mockWhere,
      });

      await expect(repository.deletePokemon(pokemonId)).rejects.toThrow('Failed to delete Pokemon');
    });
  });

  describe('inheritance from BaseRepository', () => {
    it('should have access to table property', () => {
      expect(repository.table).toBeDefined();
    });

    it('should have access to getCount method', () => {
      expect(repository.getCount).toBeDefined();
      expect(typeof repository.getCount).toBe('function');
    });

    it('should have access to currentUser through cls service', () => {
      const getCurrentUser = () => (repository as any).currentUser;

      const user = getCurrentUser();
      expect(user).toEqual(mockUser);
      expect(mockClsService.get).toHaveBeenCalledWith('user');
    });
  });
});