'use server';

import { revalidatePath } from 'next/cache';
import { ProjectService } from '@/backend/services/project.service';
import { CreateProjectSchema, UpdateProjectSchema } from '@/shared/types/project';
import type { ProjectDTO } from '@/shared/types/project';

type ActionResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Lấy danh sách dự án của user hiện tại.
 * Dùng trực tiếp trong Server Components (không cần gọi qua action).
 */
export async function getProjectsAction(): Promise<ActionResponse<ProjectDTO[]>> {
  try {
    const data = await ProjectService.getList();
    return { success: true, data: data as ProjectDTO[] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Tạo dự án mới.
 * Validate input bằng Zod trước khi gửi xuống Service.
 */
export async function createProjectAction(
  formData: FormData,
): Promise<ActionResponse<ProjectDTO>> {
  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string | null,
  };

  const validation = CreateProjectSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const data = await ProjectService.create(validation.data);
    revalidatePath('/projects');
    return { success: true, data: data as ProjectDTO };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { success: false, error: message };
  }
}

/**
 * Cập nhật thông tin dự án.
 */
export async function updateProjectAction(
  id: string,
  formData: FormData,
): Promise<ActionResponse<ProjectDTO>> {
  const raw = {
    name: formData.get('name') as string | null,
    description: formData.get('description') as string | null,
  };

  const validation = UpdateProjectSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const data = await ProjectService.update(id, validation.data);
    revalidatePath('/projects');
    return { success: true, data: data as ProjectDTO };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return { success: false, error: message };
  }
}

/**
 * Xóa dự án.
 */
export async function deleteProjectAction(id: string): Promise<ActionResponse> {
  try {
    await ProjectService.delete(id);
    revalidatePath('/projects');
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return { success: false, error: message };
  }
}
