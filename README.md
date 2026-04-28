# Project O.R.C.A. (Operational Resilience & Cloud Adaptation)

O.R.C.A. is an enterprise-grade, AI-powered Self-Healing API Gateway. Built on Spring Cloud Gateway and Next.js, it acts as a reverse proxy that detects JSON schema drift from downstream services and uses LLMs (Gemini 2.5 Flash) to patch broken payloads in real-time, preventing frontend crashes.

---

## Architecture & Tech Stack

This project is structured as a **Monorepo** containing both the gateway backend and the dashboard frontend.

### Backend (`/orca-api`)
* **Framework:** Java, Spring Boot, Spring WebFlux
* **Gateway:** Spring Cloud Gateway
* **Resilience:** Resilience4j (Circuit Breakers)
* **AI Engine:** Google Gemini GenAI SDK
* **Database:** PostgreSQL (Spring Data JPA)
* **Security:** Spring Security (JWT + Custom API Key Filters)

### Frontend (`/orca-frontend`)
* **Framework:** Next.js (React), App Router
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Charts:** Recharts 

---

## Getting Started

### Prerequisites
* Java 17+
* Node.js 18+
* PostgreSQL running on port `5432`
* Google Gemini API Key

### 1. Backend Setup (`/orca-api`)
1. Navigate to the backend directory: `cd orca-api`
2. Create a `.env` file in the `orca-api` root with the following keys:
   ```env
   POSTGRES_PASSWORD=your_db_password
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_super_secret_jwt_key
3. Ensure PostgreSQL has a database named orca_db.
4. Run the server:
    ./mvnw spring-boot:run
    The backend runs on http://localhost:8080.

### 1. Frontend Setup (`/orca-frontend`)
1. Navigate to the frontend directory:
       cd orca-frontend
3. Install dependencies:
       npm install
4. Run the development server:
       npm run dev
    The frontend runs on http://localhost:3000.

### Security Model
O.R.C.A. utilizes a Dual-Filter Security Chain. If you are adding new endpoints, you must map them correctly to avoid 401 Unauthorized errors.

1. ApiKeyFilter.java (External Traffic): * Protects downstream proxy routes (e.g., /posts/).
    Expects an x-api-key header mapped to a Tenant Project in the DB.
    Bypasses internal dashboard endpoints.

2. JwtAuthFilter.java (Internal Traffic): * Protects the Next.js Dashboard routes (/api/orca/, /api/metrics, /api/surgeries).
    Expects an Authorization: Bearer <token> header.

--> Adding a new Dashboard Endpoint? > You MUST add the path to the bypass list in ApiKeyFilter.java AND ensure it requires authentication in SecurityConfig.java.

### API Documentation
1. Gateway Proxy Endpoints (Client Facing)
These endpoints proxy traffic to downstream services and trigger the AI healing mechanism on failure.

    GET /posts/{id}
        Controller : OrcaProxyController.java
        Headers Req: x-api-key
        Flow       : Calls downstream API -> Validates Schema -> If drift detected, checks Cache -> If cache miss, triggers AI Surgeon -> Saves Patch -> Returns Healed JSON.

2. Internal Dashboard Endpoints (Frontend Facing)
These endpoints feed the Next.js dashboard. All require the Authorization: Bearer <jwt_token> header.

    GET /api/orca/stats?projectId={id}
        Controller: OrcaMetricsController.java
        Description: Returns high-level dashboard metrics (Total Heals, Latency, Status).

    GET /api/metrics?projectId={id}
        Controller: OrcaProxyController.java
        Description: Returns the chronological list of HealingRecord logs for the surgery table.

    POST /api/surgeries/{id}/revert
        Controller: OrcaProxyController.java
        Description: Allows a developer to reject an AI-generated patch, changing its status to REJECTED_BY_DEV and invalidating it in the PatchCacheManager.

    GET /api/projects (Implicitly exists based on logs)
        Description: Fetches the list of workspaces/projects available to the logged-in user.

### Key Directory Guide
Backend (orca-api/src/main/java/com/example/demo/)
    /security
        ApiKeyFilter.java - Gatekeeper for external API calls.
        JwtAuthFilter.java - Gatekeeper for internal Dashboard calls.
        SecurityConfig.java - CORS and Route mapping rules.

    Controllers:  
        OrcaProxyController.java - The main reverse proxy and AI trigger mechanism.
        OrcaMetricsController.java - Aggregation for frontend charts.

    Services:  
        AiHealingService.java - Connects to Gemini to generate JSON schema patches.
        PatchCacheManager.java - In-memory/Redis cache for instant O(1) patch lookups.

    Frontend (orca-frontend/app/)
        /page.tsx - The public marketing/landing page.
        /login/page.tsx - JWT generation and storage.
        /signup/page.tsx - JWT generation and storage.
        /dashboard/[projectId]/page.tsx - The main operational interface. Fetches stats and healing records using the stored orca_token.
