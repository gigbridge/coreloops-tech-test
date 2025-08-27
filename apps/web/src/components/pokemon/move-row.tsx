import { TableCell, TableRow } from '@coreloops-ui/table';
import { PokemonMoveDto } from '@coreloops/shared-types';
import Image from 'next/image';

interface MoveRowProps {
  pokemonMove: PokemonMoveDto;
  index?: number;
}

export function MoveRow({ pokemonMove, index = 0 }: MoveRowProps) {
  const { move, level } = pokemonMove;

  return (
    <TableRow
      className="hover:bg-muted/50 animate-in fade-in slide-in-from-bottom-2 transition-all duration-200"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <TableCell className="font-medium transition-colors duration-200">{move.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Image
            src={move.type.iconUrl}
            alt={move.type.name}
            width={20}
            height={15}
            className="shrink-0 transition-transform duration-200 hover:scale-110"
          />
          <span className="capitalize transition-colors duration-200">{move.type.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-center font-medium transition-colors duration-200">{level}</TableCell>
      <TableCell className="text-center transition-colors duration-200">
        <span className={move.power ? 'font-medium' : 'text-muted-foreground'}>{move.power ?? '—'}</span>
      </TableCell>
      <TableCell className="text-center transition-colors duration-200">
        <span className={move.accuracy ? 'font-medium' : 'text-muted-foreground'}>{move.accuracy ?? '—'}</span>
      </TableCell>
      <TableCell className="text-center font-medium transition-colors duration-200">{move.pp}</TableCell>
      <TableCell className="capitalize transition-colors duration-200">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium transition-all duration-200 ${
            move.damageClass === 'physical'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : move.damageClass === 'special'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
          }`}
        >
          {move.damageClass}
        </span>
      </TableCell>
    </TableRow>
  );
}
