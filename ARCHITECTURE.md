# Flowva System Architecture

This document outlines the high-level architecture of the Flowva project, following the **Modular Monolith** pattern with **Next.js Server Actions**.
The architecture emphasizes a clear separation between Client and Server logic, while leveraging Next.js 16's capability to call server functions directly.

## 🏗 Architecture Diagram

```mermaid
graph TD
    User((User))

    %% --- FRONTEND CONTEXT ---
    subgraph FE ["Frontend (Client Side)"]
        direction TB
        UI["UI Components<br/>(src/frontend/features/*/components)"]
        
        %% Client Logic bây giờ đơn giản hơn, chủ yếu là Form & Event
        subgraph ClientLogic ["Client Logic"]
            AuthHook["Auth Client<br/>(Supabase SDK)"]
            FormHandler["Forms & Event Handlers"]
        end

        %% Frontend Internal Flow
        UI -->|"Interaction"| FormHandler
        UI --> AuthHook
    end

    %% --- SHARED CONTRACT ---
    Contract[/"Shared Types & DTOs<br/>(src/shared/types)"/]

    %% --- BACKEND / SERVER CONTEXT (THE BIG CHANGE) ---
    subgraph Server ["Next.js Server Environment (src/)"]
        direction TB
        
        Middleware["Middleware<br/>(middleware.ts)"]
        
        %% Hai điểm tiếp nhận request chính của Next.js 16
        subgraph EntryPoints ["Server Entry Points"]
            RSC["Server Components (RSC)<br/>(src/app/page.tsx)"]
            S_Action["Server Actions<br/>(src/frontend/.../actions.ts)"]
        end

        Service["Service Layer<br/>(src/backend/services)"]
        Repo["Prisma Client<br/>(src/backend/lib/prisma)"]

        %% Server Internal Flow
        Middleware -.->|"Protect"| EntryPoints
        RSC -->|"1. Direct Function Call (GET)"| Service
        S_Action -->|"2. Remote Procedure Call (POST)"| Service
        Service -->|"Business Logic"| Repo
    end

    %% --- INFRASTRUCTURE ---
    subgraph Infra ["Supabase Infrastructure"]
        SB_Auth["Supabase Auth"]
        SB_DB[("PostgreSQL DB")]
    end

    %% --- EXTERNAL CONNECTIONS ---
    User -->|"Visit Page"| RSC
    User -->|"Interaction"| UI

    %% 1. AUTH FLOW (Hybrid)
    AuthHook -->|"Login (Client SDK)"| SB_Auth
    SB_Auth -.->|"Sync Session"| Middleware

    %% 2. DATA FLOW
    FormHandler -->|"Invoke Action ('use server')"| S_Action
    Repo -->|"Query"| SB_DB

    %% TYPE SAFETY LINKS
    Contract -.-> S_Action
    Contract -.-> Service
    Contract -.-> UI
    
    %% STYLING
    classDef fe fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef server fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef infra fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef shared fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,stroke-dasharray: 5 5;

    class UI,ClientLogic,AuthHook,FormHandler fe;
    class Middleware,RSC,S_Action,Service,Repo server;
    class SB_Auth,SB_DB infra;
    class Contract shared;
```

## 🧩 Key Concepts

### 1. Frontend (Client Components)
- **UI Components**: Located in `src/frontend/features/[feature]/components`.
- **Client Logic**: Minimal logic, primarily form handling and calling Server Actions.
- **Auth**: Uses Supabase Client SDK for direct authentication.

### 2. Server Entries
- **Server Components (RSC)**: Fetch data directly via Services during initial render (`page.tsx`).
- **Server Actions**: Handle mutations (POST/PUT/DELETE) invoked by client events. Located in `src/actions` or feature folders.

### 3. Backend Logic (Pure Server)
- **Service Layer**: Contains all business logic and authorization checks. Located in `src/backend/services`.
- **Prisma Client**: Direct database access, only called by the Service Layer.

### 4. Data Flow
1. **User Interaction** triggers a Form or Event.
2. **Server Action** is invoked directly (`use server`).
3. **Service Layer** processes the request.
4. **Database** is updated via Prisma.
5. **UI** updates (via `revalidatePath` or optimistic updates).
