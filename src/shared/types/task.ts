import { z } from 'zod';

export const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255, 'Task title is too long'),
  description: z.string().optional().nullable(),
  project_id: z.string().uuid('Invalid project ID'),
  column_id: z.string().uuid('Invalid column ID').optional().nullable(),
  sprint_id: z.string().uuid('Invalid sprint ID').optional().nullable(),
  priority: TaskPriorityEnum.optional().nullable(),
  due_date: z.string().datetime({ message: 'Invalid date format' }).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  column_id: string | null;
  sprint_id: string | null;
  created_by: string;
  priority: TaskPriority | null;
  due_date: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
}
