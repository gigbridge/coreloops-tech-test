import { type PokemonSelectEntity } from '@coreloops/data-access-layer';
import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';
import { ViewAbilityDto } from './ability.dto';
import { ViewTypeDto } from './type.dto';

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

  constructor(entity: PokemonSelectEntity) {
    if (entity) {
      Object.assign(this, entity);

      if (entity.abilities) {
        this.abilities = entity.abilities.map(ability => new ViewAbilityDto(ability.ability));
      }

      if (entity.types) {
        this.types = entity.types.map(type => new ViewTypeDto(type.type));
      }
    }
  }
}
