// This is a simplified declaration file for React Query
declare module 'react-query' {
  export interface QueryResult<TData = unknown, TError = unknown> {
    data: TData | undefined;
    error: TError | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isLoadingError: boolean;
    isRefetchError: boolean;
    isSuccess: boolean;
    status: 'idle' | 'loading' | 'error' | 'success';
    isFetching: boolean;
    refetch: () => Promise<QueryResult<TData, TError>>;
  }

  export interface MutationResult<TData = unknown, TError = unknown, TVariables = unknown> {
    data: TData | undefined;
    error: TError | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    status: 'idle' | 'loading' | 'error' | 'success';
    reset: () => void;
    mutate: (variables: TVariables) => Promise<TData>;
    mutateAsync: (variables: TVariables) => Promise<TData>;
  }

  export function useQuery<TData = unknown, TError = unknown>(
    queryKey: string | readonly unknown[],
    queryFn: () => Promise<TData>,
    options?: any
  ): QueryResult<TData, TError>;

  export function useMutation<TData = unknown, TError = unknown, TVariables = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: any
  ): MutationResult<TData, TError, TVariables>;

  export function useQueryClient(): any;
}
