/**
 * ------------------------------------------------------------------
 * ĐÂY LÀ HỢP ĐỒNG (CONTRACT) GIỮA FRONTEND VÀ BACKEND
 * ------------------------------------------------------------------
 * Quy tắc:
 * 1. Date luôn là string (ISO format).
 * 2. Phân biệt rõ: Dữ liệu trả về (DTO) và Dữ liệu gửi lên (Request).
 */

// --- 1. ENUMS & CONSTANTS (Các giá trị cố định) ---
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// --- 2. DTO (Data Transfer Object) ---
// 👉 Dữ liệu Server trả về cho Client hiển thị.
// 👉 Luôn có đầy đủ ID, thời gian và các quan hệ (Relation) đã join.
export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;   // Có thể null nếu user không nhập
  status: TaskStatus;
  priority: TaskPriority;
  order: number;                // Dùng để sắp xếp vị trí (nếu làm Kanban)
  
  // Quan trọng: Date truyền qua API luôn là chuỗi ISO "2024-01-01T10:00:00Z"
  dueDate: string | null;       
  createdAt: string;
  updatedAt: string;

  // Foreign Keys
  projectId: string;
  ownerId: string;

  // Relations (Thông tin mở rộng - đã join bảng User)
  // Backend sẽ trả về object gọn nhẹ, không trả password hash!
  assignee?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
  } | null;
}

// --- 3. REQUEST PAYLOADS (Dữ liệu gửi lên) ---

// 👉 Form tạo mới (Create)
// Không có ID, không có createdAt (DB tự sinh)
export interface CreateTaskRequest {
  title: string;                // Bắt buộc
  projectId: string;            // Bắt buộc
  description?: string;         // Optional (dấu ?)
  priority?: TaskPriority;      // Nếu không gửi, Server tự set mặc định
  status?: TaskStatus;
  dueDate?: string;             // Gửi string ISO
  assigneeId?: string;          // Chỉ gửi ID user, Backend tự check
}

// 👉 Form cập nhật (Update)
// Dùng Partial vì User có thể chỉ sửa mỗi cái Title, hoặc chỉ sửa Status
// Riêng trường hợp muốn xóa Assignee thì cần gửi null -> nên dùng Type Union
export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;  // Gửi null để xóa description cũ
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  order?: number;               // Khi kéo thả Kanban
  assigneeId?: string | null;   // Gửi null để gỡ người làm (Unassign)
}

// --- 4. FILTERS (Query Params) ---
// 👉 Dữ liệu trên thanh URL: ?status=DONE&priority=HIGH&page=1
export interface TaskFilterParams {
  page?: number;
  limit?: number;
  search?: string;              // Tìm theo title
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  isOverdue?: boolean;          // Lọc task quá hạn
}