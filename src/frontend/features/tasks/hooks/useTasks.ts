import useSWR from 'swr';
import { getTasksMock } from '../services/task.mock';
import { Task } from '@/shared/types/ui-types';

// SWR key for caching
const KEY = '/api/tasks/mock';

const fetcher = () => getTasksMock();

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(KEY, fetcher, {
    revalidateOnFocus: true, // Auto revalidate when window gets focus
    dedupingInterval: 5000, // Debounce requests
    keepPreviousData: true,
  });

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
}
