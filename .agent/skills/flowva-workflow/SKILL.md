---
name: flowva-workflow
description: Quy trình phát triển tính năng mới với Next.js Server Actions + Supabase. Dùng khi người dùng yêu cầu "tạo tính năng", "viết API", hoặc "xử lý form".
---

# Quy trình Code tính năng (Supabase + Server Actions Flow)

Khi tạo một tính năng mới (ví dụ: Tạo Task), hãy thực hiện đúng thứ tự sau:

## Bước 0: Database Schema (Nếu cần)

**Khi nào cần**: Tính năng yêu cầu table/column mới hoặc thay đổi schema.

```bash
# Tạo migration file mới
npx supabase migration new ten_migration

# Viết SQL trong file migration vừa tạo
# VD: supabase/migrations/20240315_create_tasks_table.sql

# Apply migration lên DB local
npx supabase migration up

# Generate TypeScript types
npm run gen-types
```

**Lưu ý**:
- **LUÔN LUÔN** enable RLS cho table mới
- Viết RLS policies ngay trong migration file
- Test policies kỹ trước khi push lên production

## Bước 1: Contract (Types & Validation)

**File**: `src/shared/types/[name].ts`

- Định nghĩa DTO/Interface cho request/response
- Sử dụng **Zod** để validate dữ liệu đầu vào
- Import types từ `database.types.ts` nếu cần

**Ví dụ**:
```typescript
import { z } from 'zod';
import type { Database } from './database.types';

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  project_id: z.string().uuid(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type Task = Database['public']['Tables']['tasks']['Row'];
```

## Bước 2: Backend Logic (Service)

**File**: `src/backend/services/[name].service.ts`

- Viết hàm xử lý logic và query Supabase
- **LUÔN LUÔN** check authorization trước khi query
- Hàm phải trả về dữ liệu thuần (Plain Object), không trả về Response
- Handle errors properly

**Ví dụ**:
```typescript
import { createClient } from '@/backend/lib/supabase/server';

export async function createTask(data: CreateTaskDTO, userId: string) {
  const supabase = await createClient();
  
  // Authorization check
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', data.project_id)
    .eq('user_id', userId)
    .single();
    
  if (!project) {
    throw new Error('Unauthorized');
  }
  
  // Business logic + query
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({ ...data, user_id: userId })
    .select()
    .single();
    
  if (error) throw error;
  return task;
}
```

**Lưu ý**:
- **KHÔNG BAO GIỜ** bypass RLS bằng admin client trừ khi thực sự cần
- Sử dụng `createClient()` từ `@/backend/lib/supabase/server` (cookies-based)
- RLS sẽ tự động validate permissions ở database layer

## Bước 3: Server Action (The Glue)

**File**: `src/frontend/features/[name]/actions.ts`

- Khai báo `"use server";` ở đầu file
- Viết hàm `export async function [actionName]` gọi Service từ Bước 2
- Validate input bằng Zod schema
- Sử dụng `revalidatePath()` hoặc `revalidateTag()` nếu data thay đổi
- Bọc lỗi bằng `try-catch` và trả về `{ success, error, data }`

**Ví dụ**:
```typescript
"use server";

import { revalidatePath } from 'next/cache';
import { createTaskSchema } from '@/shared/types/task';
import { createTask } from '@/backend/services/task.service';
import { createClient } from '@/backend/lib/supabase/server';

export async function createTaskAction(formData: FormData) {
  try {
    // Get current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    
    // Validate input
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      project_id: formData.get('project_id'),
    };
    const validData = createTaskSchema.parse(rawData);
    
    // Call service
    const task = await createTask(validData, user.id);
    
    // Revalidate
    revalidatePath('/dashboard');
    
    return { success: true, data: task };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

**Lưu ý**:
- **KHÔNG BAO GIỜ** gọi Supabase trực tiếp - phải qua Service
- Luôn validate input trước khi gọi Service
- Luôn return object `{ success, error?, data? }` để Client dễ handle

## Bước 4: Frontend Integration

### Server Component (GET data)

**File**: `src/app/(main)/dashboard/page.tsx`

```typescript
import { getTasks } from '@/backend/services/task.service';
import { createClient } from '@/backend/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const tasks = await getTasks(user!.id);
  
  return <TaskList tasks={tasks} />;
}
```

### Client Component (POST/PUT/DELETE)

**File**: `src/frontend/features/tasks/components/CreateTaskForm.tsx`

```typescript
"use client";

import { useTransition } from 'react';
import { createTaskAction } from '../actions';

export function CreateTaskForm() {
  const [isPending, startTransition] = useTransition();
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTaskAction(formData);
      if (result.success) {
        // Show success toast
      } else {
        // Show error toast
      }
    });
  }
  
  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

**Lưu ý**:
- Dùng `useTransition` hoặc `useFormStatus` để handle loading state
- Không lưu server data vào Zustand - chỉ dùng cho UI state
- Sử dụng `revalidatePath` trong action để auto-refresh data

## Checklist trước khi commit

- [ ] Migration file đã được tạo và apply (nếu có thay đổi schema)
- [ ] TypeScript types đã được generate (`npm run gen-types`)
- [ ] RLS policies đã được enable và test
- [ ] Service layer có authorization check
- [ ] Server Action validate input bằng Zod
- [ ] Server Action có `revalidatePath` (nếu data thay đổi)
- [ ] Client component handle loading và error states
- [ ] Code đã được format (`npm run format`)
