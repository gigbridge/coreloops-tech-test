import { Module } from '@nestjs/common';
import { MoveRepository } from 'src/app/repositories/moves/move.repository';

@Module({
  exports: [MoveRepository],
  providers: [MoveRepository],
})
export class MoveModule {}