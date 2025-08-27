import { UserStore } from '@coreloops-api/shared/contexts';
import { DrizzleProvider } from '@coreloops/data-access-layer';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { MoveRepository } from './move.repository';

describe('MoveRepository', () => {
  let repository: MoveRepository;
  let mockDrizzleProvider: jest.Mocked<DrizzleProvider>;
  let mockClsService: jest.Mocked<ClsService<UserStore>>;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    isAdmin: false,
  };

  const mockMove = {
    id: 'move-123',
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
  };

  const mockPokemonMove = {
    pokemonId: 'pokemon-123',
    moveId: 'move-123',
    level: 15,
    move: mockMove,
  };

  beforeEach(async () => {
    const mockPokemonMoveEntityQuery = {
      findMany: jest.fn(),
    };

    const mockMoveEntityQuery = {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    };

    const mockDb = {
      query: {
        pokemonMoveEntity: mockPokemonMoveEntityQuery,
        moveEntity: mockMoveEntityQuery,
      },
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    mockDrizzleProvider = {
      db: mockDb,
    } as any;

    mockClsService = {
      get: jest.fn().mockReturnValue(mockUser),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoveRepository,
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

    repository = module.get<MoveRepository>(MoveRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMovesByPokemonId', () => {
    it('should return moves for a specific pokemon ordered by level', async () => {
      const pokemonId = 'pokemon-123';
      const expectedMoves = [mockPokemonMove];

      (mockDrizzleProvider.db.query.pokemonMoveEntity.findMany as jest.Mock).mockResolvedValue(expectedMoves);

      const result = await repository.findMovesByPokemonId(pokemonId);

      expect(mockDrizzleProvider.db.query.pokemonMoveEntity.findMany as jest.Mock).toHaveBeenCalledWith({
        where: expect.any(Object), // eq(pokemonMoveEntity.pokemonId, pokemonId)
        orderBy: expect.any(Array), // [asc(pokemonMoveEntity.level)]
        with: {
          move: {
            with: {
              type: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedMoves);
    });

    it('should return empty array when pokemon has no moves', async () => {
      const pokemonId = 'pokemon-no-moves';
      (mockDrizzleProvider.db.query.pokemonMoveEntity.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findMovesByPokemonId(pokemonId);

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const pokemonId = 'pokemon-123';
      const dbError = new Error('Database connection failed');
      (mockDrizzleProvider.db.query.pokemonMoveEntity.findMany as jest.Mock).mockRejectedValue(dbError);

      await expect(repository.findMovesByPokemonId(pokemonId)).rejects.toThrow(dbError);
    });
  });

  describe('findMoveById', () => {
    it('should return move with type information when found', async () => {
      const moveId = 'move-123';
      (mockDrizzleProvider.db.query.moveEntity.findFirst as jest.Mock).mockResolvedValue(mockMove);

      const result = await repository.findMoveById(moveId);

      expect(mockDrizzleProvider.db.query.moveEntity.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: expect.any(Object), // eq(moveEntity.id, moveId)
        with: {
          type: true,
        },
      });
      expect(result).toEqual(mockMove);
    });

    it('should return undefined when move not found', async () => {
      const moveId = 'non-existent-move';
      (mockDrizzleProvider.db.query.moveEntity.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.findMoveById(moveId);

      expect(result).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      const moveId = 'move-123';
      const dbError = new Error('Database connection failed');
      (mockDrizzleProvider.db.query.moveEntity.findFirst as jest.Mock).mockRejectedValue(dbError);

      await expect(repository.findMoveById(moveId)).rejects.toThrow(dbError);
    });
  });

  describe('findAllMoves', () => {
    it('should return all moves with type information ordered by name', async () => {
      const expectedMoves = [mockMove];
      (mockDrizzleProvider.db.query.moveEntity.findMany as jest.Mock).mockResolvedValue(expectedMoves);

      const result = await repository.findAllMoves();

      expect(mockDrizzleProvider.db.query.moveEntity.findMany as jest.Mock).toHaveBeenCalledWith({
        with: {
          type: true,
        },
        orderBy: expect.any(Array), // [asc(moveEntity.name)]
      });
      expect(result).toEqual(expectedMoves);
    });

    it('should return empty array when no moves exist', async () => {
      (mockDrizzleProvider.db.query.moveEntity.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAllMoves();

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      (mockDrizzleProvider.db.query.moveEntity.findMany as jest.Mock).mockRejectedValue(dbError);

      await expect(repository.findAllMoves()).rejects.toThrow(dbError);
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
      // Access the protected currentUser property through a test method
      const getCurrentUser = () => (repository as any).currentUser;

      const user = getCurrentUser();
      expect(user).toEqual(mockUser);
      expect(mockClsService.get).toHaveBeenCalledWith('user');
    });
  });
});
