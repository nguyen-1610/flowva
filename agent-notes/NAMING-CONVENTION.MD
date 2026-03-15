# Naming Convention for Agent Notes

## Overview

This document defines naming conventions for agent-to-agent communication files within the `agent-notes/` directory structure. The naming system ensures clear phase tracking and communication flow between AI agents across sessions.

## Directory Naming

- Use lowercase with hyphens: `backend-agent/`, `frontend-agent/`, `spec-lead/`
- Use generic role names, not specific AI model names (e.g., `backend-agent` not `claude-backend`)
- Keep names descriptive but concise

## File Naming Pattern: Phase-Based System

All communication files follow this pattern:
```
{phase}.{sequence}-{direction}.md
```

### Phase Numbering
- `1-` = Phase 1 (Requirements/Planning)
- `2-` = Phase 2 (Design)
- `3-` = Phase 3 (Implementation)
- `4-` = Phase 4 (Testing/Review)
- etc.

### Sequence Numbering (Optional)
- `.1`, `.2`, `.3` = Thứ tự giao tiếp trong cùng phase (thay cho timestamps)
- **NOT for sub-tasks** - chỉ để đánh số thứ tự messages
- Example: `1.1-from-lead.md` = message đầu tiên, `1.2-from-lead.md` = message thứ hai

### Direction Indicators
- `-from-{agent}` = Message/instruction FROM another agent
- `-to-{agent}` = Message/instruction TO another agent
- `-status` = Current status/progress report
- `-notes` = General notes for the phase

### Task Management Rules
- **Tasks chỉ nằm trong `{phase}-from-lead.md`**
- Nếu cần update tasks → SỬA file `{phase}-from-lead.md`, KHÔNG tạo file mới
- KHÔNG tạo `{phase}.1-from-lead.md` để thêm task
- Sequence numbers (`.1`, `.2`) chỉ dùng cho giao tiếp giữa agents, không phải tasks

### Examples

**Task Instructions** (always in main file):
- `1-from-lead.md` - Phase 1 tasks từ spec-lead
- `2-from-lead.md` - Phase 2 tasks từ spec-lead
- Update tasks? → Edit `1-from-lead.md`, don't create `1.1-from-lead.md`

**Agent Communication** (use sequence numbers):
- `1.1-from-backend.md` - Message đầu tiên từ backend-agent
- `1.2-from-backend.md` - Message thứ hai từ backend-agent
- `1.1-to-database.md` - Message đầu tiên gửi cho database-agent
- `1.2-to-database.md` - Message thứ hai gửi cho database-agent

**Status & Notes**:
- `1-status.md` - Overall phase status
- `1-notes.md` - General notes for phase

## File Content Guidelines

### What to Include
- Relevant context for the specific agent role
- Current state and progress
- Key decisions and rationale
- Dependencies and constraints
- Next steps and priorities

### What to Avoid
- Cross-agent implementation details (keep in respective folders)
- Outdated information (archive or remove)
- Duplicate information across multiple files
- Overly verbose documentation

## Markdown Formatting

- Use clear headings (##, ###)
- Include code blocks with language tags
- Use bullet points for lists
- Add links to related files when relevant
- Keep line length reasonable for readability

## Version Control

- Commit agent notes regularly
- Use descriptive commit messages
- Archive old context when starting new major features
- Keep notes synchronized with actual codebase state


## Benefits of This System

1. **Clear Phase Tracking**: Any agent can immediately see what phase the project is in
2. **Communication Flow**: Direction indicators show who sent/received messages
3. **Session Continuity**: New agents can quickly understand project state
4. **Chronological Order**: Sequence numbers replace timestamps for message ordering
5. **Scalability**: Easy to add more messages as needed
6. **Task Clarity**: Tasks always in main `{phase}-from-lead.md` file

## File Organization by Agent

Each agent folder should contain:
- Phase-based task files (e.g., `1-from-lead.md`) - Tasks from lead
- Communication files with sequence (e.g., `1.1-from-backend.md`) - Messages from other agents
- Status files for tracking progress (e.g., `1-status.md`)
- Notes files for internal documentation (e.g., `1-notes.md`)

## Reading Order

When a new agent takes over:
1. Read `shared/{phase}-report.md` to understand what was done
2. Read `{phase}-from-lead.md` in your folder for current tasks
3. Check `{phase}.{n}-from-{agent}.md` files for messages from other agents
4. Review `{phase}-status.md` for progress updates

## Example Workflow

```
spec-lead/
└── (no files - lead gives instructions to others)

backend-agent/
├── 1-from-lead.md          # Tasks from spec-lead (main file, updated as needed)
├── 1.1-from-database.md    # First message from database-agent
├── 1.2-from-database.md    # Second message from database-agent
├── 1-status.md             # Overall phase 1 status
└── 1-notes.md              # Internal notes

database-agent/
├── 1-from-lead.md          # Tasks from spec-lead (main file)
├── 1.1-to-backend.md       # First message to backend-agent
└── 1-status.md             # Phase 1 progress

shared/
├── 1-plan.md               # Phase 1 plan (created by lead)
├── 1-report.md             # Phase 1 final report
└── 1-bugs.md               # Bugs discovered in phase 1
```

## Common Mistakes to Avoid

❌ **WRONG**: Creating `1.1-from-lead.md` to add more tasks
✅ **RIGHT**: Edit `1-from-lead.md` to update tasks

❌ **WRONG**: Using `.1`, `.2` for sub-tasks
✅ **RIGHT**: Using `.1`, `.2` for message sequence (communication order)

❌ **WRONG**: Creating multiple task files per phase
✅ **RIGHT**: One task file per phase (`{phase}-from-lead.md`), update as needed
