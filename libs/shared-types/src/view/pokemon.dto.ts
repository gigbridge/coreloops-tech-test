import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ViewAbilityDto } from './ability.dto';
import { PokemonMoveDto } from './pokemon-move.dto';
import { ViewTypeDto } from './type.dto';

interface PokemonSelectEntity {
  id: string;
  name: string;
  pokedexNumber: number;
  abilities?: any[];
  types?: any[];
  moves?: any[];
}

export class ViewPokemonDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  pokedexNumber!: number;

  @IsArray()
  abilities!: ViewAbilityDto[];

  @IsArray()
  types!: ViewTypeDto[];

  @IsOptional()
  @IsArray()
  moves?: PokemonMoveDto[];

  constructor(entity: PokemonSelectEntity) {
    if (entity) {
      Object.assign(this, entity);

      if (entity.abilities) {
        this.abilities = entity.abilities.map((ability: any) => new ViewAbilityDto(ability.ability));
      }

      if (entity.types) {
        this.types = entity.types.map((type: any) => new ViewTypeDto(type.type));
      }

      if (entity.moves) {
        this.moves = entity.moves.map((pokemonMove: any) => new PokemonMoveDto(pokemonMove));
      }
    }
  }
}
