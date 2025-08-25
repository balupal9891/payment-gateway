import { useState, useEffect, useCallback } from "react";
import apiClient from "./apiClient";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Hook for making API calls (manual trigger)
 */

export function useApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(apiCall: () => Promise<AxiosResponse<T>>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();
        setLoading(false);
        return response.data;
      } catch (err: any) {
        setLoading(false);
        setError(err.userMessage || err.message || "An error occurred");
        throw err;
      }
    },
    []
  );

  const get = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>(() => apiClient.get<T>(url, config)),
    [request]
  );

  const post = useCallback(
    <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>(() => apiClient.post<T>(url, data, config)),
    [request]
  );

  const put = useCallback(
    <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>(() => apiClient.put<T>(url, data, config)),
    [request]
  );

  const patch = useCallback(
    <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>(() => apiClient.patch<T>(url, data, config)),
    [request]
  );

  const del = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>(() => apiClient.delete<T>(url, config)),
    [request]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError: () => setError(null),
  };
}

/**
 * Hook for fetching data on mount or dependency change
 */
interface UseFetchOptions<T> {
  dependencies?: any[];
  skip?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { dependencies = [], skip = false, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(url);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || "Failed to fetch data";
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, skip, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 */
interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>,
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);
        setData(response.data);
        onSuccess?.(response.data, variables);
        return response.data;
      } catch (err: any) {
        const errorMessage = err.userMessage || err.message || "Mutation failed";
        setError(errorMessage);
        onError?.(err, variables);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
}
