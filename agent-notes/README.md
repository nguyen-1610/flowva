# Agent Notes

## Purpose

This directory contains context files and documentation for different AI agents working on this project. The goal is to optimize context management and clearly define responsibilities for each agent, avoiding confusion and scope creep.

## Directory Structure

```
agent-notes/
├── backend-agent/     # Backend development context and notes
├── database-agent/    # Database schema and migration context
├── frontend-agent/    # Frontend development context and notes
├── spec-lead/         # Specification and planning context
├── shared/            # Shared information for all agents (plans, bugs, reports, summary)
├── README.md          # This file
└── NAMING-CONVENTION.MD  # Naming conventions for agent notes
```

## Agent Roles

### backend-agent
Handles backend API development, business logic, server-side operations, and integration with external services.

### database-agent
Manages database schema design, migrations, queries optimization, and data modeling.

### frontend-agent
Responsible for UI/UX implementation, client-side logic, component development, and frontend architecture.

### spec-lead
Oversees project specifications, requirements gathering, design documentation, and task planning.

## Usage Guidelines

1. **Context Isolation**: Each agent folder contains only relevant context for that specific role
2. **Session Flexibility**: Use generic agent names (e.g., `backend-agent`) instead of specific AI model names to allow different agents across sessions
3. **Clear Boundaries**: Keep agent responsibilities well-defined to prevent overlap and confusion
4. **Documentation**: Maintain up-to-date notes in each agent's folder for continuity across sessions

## File Organization

See [NAMING-CONVENTION.MD](./NAMING-CONVENTION.MD) for detailed naming conventions and file organization guidelines.

## Skills Reference

This project has the following AI skills available in `.agent/skills/`:

### Architecture & Workflow
- **flowva-architecture** - System architecture guidelines for Flowva
- **flowva-workflow** - Development workflow and processes

### Best Practices
- **vercel-react-best-practices** - React/Next.js optimization and best practices
- **supabase-postgres-best-practices** - Database optimization and Supabase patterns
- **web-design-guidelines** - UI/UX design standards

### Tools
- **skill-creator** - Tool for creating new AI skills

Agents should reference these skills when working on related tasks.
