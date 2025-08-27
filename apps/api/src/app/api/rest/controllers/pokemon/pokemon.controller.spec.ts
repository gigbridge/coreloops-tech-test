import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';

describe('PokemonController', () => {
  let controller: PokemonController;
  let pokemonService: jest.Mocked<PokemonService>;

  const mockPokemon = {
    id: 'pokemon-123',
    name: 'Pikachu',
    pokedexNumber: 25,
    abilities: [],
    types: [],
    moves: [],
  } as ViewPokemonDto;

  beforeEach(async () => {
    const mockPokemonService = {
      findMultiplePokemon: jest.fn(),
      findPokemonWithMoves: jest.fn(),
      deletePokemon: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: mockPokemonService,
        },
      ],
    })
      .overrideGuard(require('@coreloops-api/shared/guards/admin.guard').AdminGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<PokemonController>(PokemonController);
    pokemonService = module.get(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findPokemonById', () => {
    it('should return pokemon with moves when found', async () => {
      pokemonService.findPokemonWithMoves.mockResolvedValue(mockPokemon);

      const result = await controller.findPokemonById('pokemon-123');

      expect(result).toEqual(mockPokemon);
      expect(pokemonService.findPokemonWithMoves).toHaveBeenCalledWith('pokemon-123');
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      pokemonService.findPokemonWithMoves.mockRejectedValue(
        new NotFoundException('Pokemon with id pokemon-123 not found'),
      );

      await expect(controller.findPokemonById('pokemon-123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for other errors', async () => {
      pokemonService.findPokemonWithMoves.mockRejectedValue(new Error('Database error'));

      await expect(controller.findPokemonById('pokemon-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePokemon', () => {
    it('should delete pokemon successfully', async () => {
      pokemonService.deletePokemon.mockResolvedValue();

      await controller.deletePokemon('pokemon-123');

      expect(pokemonService.deletePokemon).toHaveBeenCalledWith('pokemon-123');
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      pokemonService.deletePokemon.mockRejectedValue(new NotFoundException('Pokemon with id pokemon-123 not found'));

      await expect(controller.deletePokemon('pokemon-123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for other errors', async () => {
      pokemonService.deletePokemon.mockRejectedValue(new Error('Database error'));

      await expect(controller.deletePokemon('pokemon-123')).rejects.toThrow(NotFoundException);
    });
  });
});
