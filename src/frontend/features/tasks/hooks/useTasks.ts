import useSWR from 'swr';
import { getTasksAction } from '../actions';
import { TaskDTO } from '@/shared/types/task';

// SWR key for caching
const getKey = (projectId: string | null) => projectId ? `/api/projects/${projectId}/tasks` : null;

export function useTasks(projectId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<TaskDTO[]>(
    getKey(projectId),
    async () => {
      if (!projectId) return [];
      const res = await getTasksAction(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
    }
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
}
