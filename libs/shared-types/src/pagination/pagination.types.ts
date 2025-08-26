import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CursorQueryDto {
  @IsOptional()
  @IsString()
  afterId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

export type Connection<T> = {
  nodes: T[];
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total: number;
  };
};
