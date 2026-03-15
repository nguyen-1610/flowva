'use server';

import { revalidatePath } from 'next/cache';
import { TaskService } from '@/backend/services/task.service';
import { CreateTaskSchema, UpdateTaskSchema, type TaskDTO } from '@/shared/types/task';

type ActionResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get all tasks for a project
 */
export async function getTasksAction(projectId: string): Promise<ActionResponse<TaskDTO[]>> {
  try {
    const data = await TaskService.getList(projectId);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    return { success: false, error: message };
  }
}

/**
 * Get tasks by column (Kanban board view)
 */
export async function getTasksByColumnAction(
  projectId: string,
  columnId: string
): Promise<ActionResponse<TaskDTO[]>> {
  try {
    const data = await TaskService.getByColumn(projectId, columnId);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    return { success: false, error: message };
  }
}

/**
 * Get backlog tasks (not in any column)
 */
export async function getBacklogTasksAction(
  projectId: string
): Promise<ActionResponse<TaskDTO[]>> {
  try {
    const data = await TaskService.getBacklog(projectId);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch backlog tasks';
    return { success: false, error: message };
  }
}

/**
 * Get a single task by ID
 */
export async function getTaskAction(id: string): Promise<ActionResponse<TaskDTO>> {
  try {
    const data = await TaskService.get(id);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch task';
    return { success: false, error: message };
  }
}

/**
 * Create a new task
 */
export async function createTaskAction(
  formData: FormData
): Promise<ActionResponse<TaskDTO>> {
  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string | null,
    project_id: formData.get('project_id') as string,
    column_id: formData.get('column_id') as string | null,
    sprint_id: formData.get('sprint_id') as string | null,
    priority: formData.get('priority') as string | null,
    due_date: formData.get('due_date') as string | null,
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : null,
  };

  const validation = CreateTaskSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const data = await TaskService.create(validation.data);
    revalidatePath('/projects/[id]', 'page');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return { success: false, error: message };
  }
}

/**
 * Update an existing task
 */
export async function updateTaskAction(
  id: string,
  formData: FormData
): Promise<ActionResponse<TaskDTO>> {
  const raw = {
    title: formData.get('title') as string | null,
    description: formData.get('description') as string | null,
    column_id: formData.get('column_id') as string | null,
    sprint_id: formData.get('sprint_id') as string | null,
    priority: formData.get('priority') as string | null,
    due_date: formData.get('due_date') as string | null,
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : null,
  };

  const validation = UpdateTaskSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const data = await TaskService.update(id, validation.data);
    revalidatePath('/projects/[id]', 'page');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    return { success: false, error: message };
  }
}

/**
 * Delete a task
 */
export async function deleteTaskAction(id: string): Promise<ActionResponse> {
  try {
    await TaskService.delete(id);
    revalidatePath('/projects/[id]', 'page');
    revalidatePath('/dashboard');
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    return { success: false, error: message };
  }
}
