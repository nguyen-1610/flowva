'use server';

import { BoardService } from '@/backend/services/board.service';

type ActionResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get board columns for a project
 */
export async function getColumnsAction(projectId: string): Promise<ActionResponse<any[]>> {
  try {
    const data = await BoardService.getColumns(projectId);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch columns';
    return { success: false, error: message };
  }
}
