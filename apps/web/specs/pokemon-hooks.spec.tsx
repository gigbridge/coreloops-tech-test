import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePokemonDetail, usePokemonDelete } from '../src/api/hooks/use-pokemon';
import { usePokemonWithMoves } from '../src/hooks/use-pokemon-with-moves';

// Mock the API client
jest.mock('../src/api/api-client', () => ({
  apiFetch: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Pokemon Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePokemonDetail', () => {
    it('should be enabled when pokemonId is provided', () => {
      const { result } = renderHook(() => usePokemonDetail('test-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should be disabled when pokemonId is null', () => {
      const { result } = renderHook(() => usePokemonDetail(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('usePokemonDelete', () => {
    it('should return mutation object with proper methods', () => {
      const { result } = renderHook(() => usePokemonDelete(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('usePokemonWithMoves', () => {
    it('should return pokemon data and moves array', () => {
      const { result } = renderHook(() => usePokemonWithMoves('test-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.moves).toEqual([]);
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle null pokemonId', () => {
      const { result } = renderHook(() => usePokemonWithMoves(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.moves).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });
});