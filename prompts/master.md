# MASTER DEVELOPMENT PROMPT

## AI Business Agent Platform — Next.js + Vercel + PostgreSQL

You are a senior SaaS architect, Next.js/TypeScript engineer, AI engineer, database architect, and security engineer.

Build a production-ready, multi-tenant SaaS called:

**AI Business Agent Platform**

The platform allows businesses to create AI agents that understand their business, access approved business tools, use company knowledge, execute workflows, communicate with customers, and request human approval for sensitive actions.

The goal is NOT to build a generic chatbot.

The goal is to build an **AI employee / business automation platform** that performs real business work.

---

# 1. PRODUCT VISION

Businesses should be able to connect:

* Gmail
* Outlook
* Google Calendar
* Slack
* Microsoft Teams
* Shopify
* WooCommerce
* HubSpot
* CRM systems
* REST APIs
* Webhooks
* Knowledge documents
* Websites
* Internal business information

Then create AI agents such as:

* AI Sales Agent
* AI Customer Support Agent
* AI Lead Qualification Agent
* AI Appointment Agent
* AI RFQ Agent
* AI Quotation Agent
* AI E-commerce Agent
* AI Recruitment Agent
* AI Operations Agent

An agent should be able to:

1. Understand instructions.
2. Search company knowledge.
3. Read approved business data.
4. Call approved tools.
5. Perform multi-step tasks.
6. Create/update records.
7. Draft messages.
8. Ask for human approval when required.
9. Continue after approval.
10. Record every important action.
11. Track AI cost and usage.

---

# 2. CORE PRODUCT PRINCIPLE

The AI should perform useful business work.

Do NOT build the application around:

"Ask our AI anything."

Build it around:

"Tell our AI what business task you want automated."

Example:

User:

"Whenever we receive an RFQ by email, extract the products and quantities, check our product knowledge, create a draft quotation, and ask me for approval before sending it."

The platform should create:

```text
New Email
   ↓
Extract RFQ
   ↓
Search Knowledge
   ↓
Calculate/prepare quote
   ↓
Create draft
   ↓
Human Approval
   ↓
Send Email
   ↓
Create CRM Task
   ↓
Log Everything
```

---

# 3. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change something.

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* React Flow

## Backend

Use Next.js as the primary application/backend layer.

Use:

* Server Components
* Server Actions where appropriate
* Route Handlers
* API routes
* TypeScript services
* Background jobs/workflows

Do NOT create a separate Node.js backend initially.

Do NOT create a Laravel backend.

The objective is to keep the first production version as a modular monolith.

---

# 4. DATABASE

Use:

**PostgreSQL**

Recommended providers:

* Neon
* Supabase
* Vercel Marketplace PostgreSQL providers
* AWS PostgreSQL later if required

Do not tightly couple business logic to a specific database provider.

Use PostgreSQL features where useful.

Use:

**pgvector**

for knowledge embeddings/RAG.

---

# 5. ORM

Use:

**Prisma**

unless there is a compelling reason to use Drizzle.

Database models must reflect the database schema specified in the separate database-schema specification.

Use migrations.

Never modify production schema manually without a migration.

---

# 6. AI STACK

Use the Vercel AI SDK.

Create an abstraction around AI providers.

The system must not be hardcoded to OpenAI.

Support:

```text
OpenAI
Anthropic
Google Gemini
```

through a provider abstraction.

Example conceptual interface:

```ts
interface AIProvider {
    generateText(): Promise<AIResponse>;
    streamText(): AsyncIterable<string>;
    generateStructuredObject(): Promise<unknown>;
}
```

The exact implementation can follow the current AI SDK APIs.

---

# 7. AI MODEL ARCHITECTURE

Agents must contain:

```text
name
description
purpose
instructions
provider
model
temperature
maxSteps
tools
knowledge
permissions
approval rules
status
```

An agent should not directly access the database.

Instead:

```text
AI Agent
    ↓
Tool Registry
    ↓
Permission Check
    ↓
Workspace Authorization
    ↓
Approval Check
    ↓
Tool Executor
    ↓
External System / Database
```

AI is never the security authority.

The server is always the authority.

---

# 8. MULTI-TENANCY

The platform is a multi-tenant SaaS.

Hierarchy:

```text
User
 ↓
Workspace
 ↓
Agents
Workflows
Customers
Knowledge
Conversations
Integrations
Tasks
Analytics
Billing
```

A user can belong to multiple workspaces.

Every tenant-owned database record must contain:

```text
workspaceId
```

Every query must be workspace-scoped.

Never allow:

```ts
db.customer.findUnique({
    where: { id }
});
```

without verifying workspace ownership.

Prefer:

```ts
db.customer.findFirst({
    where: {
        id,
        workspaceId
    }
});
```

Use authorization helpers and server-side checks.

---

# 9. USER ROLES

Support:

```text
owner
admin
manager
member
viewer
```

Permissions should eventually support granular permissions such as:

```text
agents.view
agents.create
agents.update
agents.delete

workflows.view
workflows.create
workflows.update
workflows.execute

customers.view
customers.create
customers.update
customers.delete

knowledge.view
knowledge.upload
knowledge.delete

integrations.view
integrations.manage

billing.view
billing.manage

settings.manage
audit.view
```

---

# 10. APPLICATION NAVIGATION

Main sidebar:

```text
Dashboard

AI Agents
Automations
Tasks

Knowledge

Customers
Conversations

Integrations

Analytics
Activity / Logs

Templates

Settings
Billing
```

Keep the UI understandable for non-technical business owners.

Do not expose unnecessary developer terminology.

---

# 11. DASHBOARD

Dashboard should display:

* Active AI agents
* Running automations
* Pending approvals
* Completed tasks
* Failed tasks
* New leads
* Open conversations
* AI usage
* AI cost
* Estimated hours saved
* Workflow success rate

Include useful charts.

Example:

```text
AI Work Completed
Automation Success
Leads Processed
Hours Saved
AI Cost
```

---

# 12. AI AGENTS

Agents are the core product.

Agent list:

```text
Name
Purpose
Status
Model
Tasks
Success Rate
Last Active
```

Agent creation wizard:

```text
1. Purpose
2. Instructions
3. Knowledge
4. Tools
5. Permissions
6. Approval Rules
7. Test
8. Activate
```

Agent detail page:

```text
Overview
Instructions
Knowledge
Tools
Permissions
Approval Rules
Runs
Analytics
Settings
```

Agent statuses:

```text
draft
testing
active
paused
archived
```

---

# 13. AGENT EXECUTION LOOP

The conceptual execution process:

```text
Load Agent
   ↓
Load Instructions
   ↓
Load Knowledge
   ↓
Load Tools
   ↓
Receive User/Event Input
   ↓
AI Model
   ↓
Determine Next Action
   ↓
Validate Tool Call
   ↓
Check Permission
   ↓
Check Approval Rule
   ↓
Execute Tool
   ↓
Return Result
   ↓
AI Model
   ↓
Continue
   ↓
Final Response
```

Implement maximum step limits.

Example:

```text
maxSteps = 10
```

Prevent infinite loops.

---

# 14. TOOL SYSTEM

Build a centralized Tool Registry.

Conceptually:

```ts
interface AgentTool {
    name: string;
    description: string;
    inputSchema: ZodSchema;
    permissions: string[];
    requiresApproval: boolean;
    execute(input, context): Promise<ToolResult>;
}
```

Initial tools:

```text
search_knowledge
create_customer
update_customer
search_customer
create_task
update_task
send_email
draft_email
create_calendar_event
search_calendar
send_notification
http_request
trigger_webhook
```

Later:

```text
shopify_create_order
shopify_update_order
hubspot_create_contact
slack_send_message
whatsapp_send_message
```

---

# 15. HUMAN APPROVAL

Sensitive actions must support approval.

Examples:

```text
Send external email
Issue refund
Change price
Create quote
Delete record
Create contract
Send customer-facing message
```

Flow:

```text
AI requests action
       ↓
Approval required
       ↓
Task / Approval created
       ↓
User reviews
       ↓
Approve / Reject
       ↓
Workflow continues
```

The approval decision must be recorded.

---

# 16. AUTOMATIONS

Build a visual workflow builder using:

**React Flow**

Users should be able to create:

```text
Trigger
   ↓
Action
   ↓
AI
   ↓
Condition
   ↓
Action
```

Node categories:

### Triggers

```text
Manual
Webhook
Schedule
New Customer
New Lead
New Email
```

### AI

```text
AI Agent
Generate Text
Summarize
Classify
Extract Data
Search Knowledge
```

### Logic

```text
IF / ELSE
Switch
Filter
Delay
Stop
```

### Actions

```text
Send Email
Create Customer
Update Customer
Create Task
Notification
HTTP Request
Webhook
Calendar Event
```

---

# 17. WORKFLOW VERSIONING

Never mutate a published workflow directly.

Use:

```text
Workflow
    ↓
Workflow Version
    ↓
Nodes
    ↓
Connections
```

Example:

```text
Workflow v1
Workflow v2
Workflow v3
```

Only one version is active.

When a user edits a published workflow:

```text
Published v1
      ↓
Create Draft v2
      ↓
Edit
      ↓
Test
      ↓
Publish
```

---

# 18. WORKFLOW EXECUTION

Every workflow execution must have:

```text
executionId
workflowId
workflowVersionId
status
triggerData
currentNode
startTime
completionTime
error
duration
```

Each node execution must record:

```text
node
input
output
status
attempt
error
duration
timestamps
```

Statuses:

```text
pending
running
waiting
completed
failed
cancelled
```

---

# 19. BACKGROUND EXECUTION

Do not perform long-running AI/workflow operations directly inside normal HTTP requests.

Use durable/background execution where appropriate.

Examples:

```text
Document processing
Embedding generation
Large AI tasks
Email processing
Workflow execution
Scheduled workflows
Webhook processing
Bulk imports
```

Use Vercel-compatible background/durable workflow mechanisms or an external queue when required.

Keep the application architecture portable.

---

# 20. KNOWLEDGE BASE

Businesses can upload:

```text
PDF
DOCX
TXT
CSV
XLSX
```

and provide:

```text
Website URL
Manual text
FAQs
```

Pipeline:

```text
Upload
 ↓
Store
 ↓
Extract Text
 ↓
Clean
 ↓
Chunk
 ↓
Generate Embeddings
 ↓
Store pgvector
```

Search:

```text
User Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Relevant Chunks
 ↓
Context
 ↓
AI Agent
```

Implement metadata filtering by:

```text
workspace
knowledge source
document
agent
```

---

# 21. RAG

The RAG system must support:

* semantic search
* metadata filtering
* top-K retrieval
* configurable similarity threshold
* source references
* chunk metadata

The AI response should be able to identify which knowledge documents were used.

---

# 22. CUSTOMERS / CRM

Built-in lightweight CRM.

Customer fields:

```text
Name
Company
Email
Phone
Website
Status
Lead Score
Source
Assigned User
Assigned Agent
Tags
Notes
Custom Fields
```

Customer detail:

```text
Overview
Activity
Conversations
Tasks
Notes
AI Summary
```

Do not attempt to become a full Salesforce replacement in MVP.

---

# 23. CONVERSATIONS

Channels initially:

```text
Email
Website Chat
```

Architecture must allow:

```text
WhatsApp
Slack
Telegram
SMS
```

later.

Conversation:

```text
Customer
 ↓
Conversation
 ↓
Messages
 ↓
Human / AI
```

Support human takeover.

---

# 24. INTEGRATIONS

Initial integrations:

```text
Gmail
Google Calendar
Slack
HubSpot
Shopify
WooCommerce
REST API
Webhooks
SMTP
```

Use OAuth where supported.

Store credentials securely.

Never expose OAuth secrets to the browser.

Use encrypted server-side storage.

---

# 25. WEBHOOKS

Support incoming and outgoing webhooks.

Incoming:

```text
POST /api/webhooks/{provider}
```

Outgoing:

```text
Workflow
 ↓
Webhook
 ↓
External System
```

Verify signatures where supported.

Log:

```text
event
payload
status
response
attempt
timestamp
```

---

# 26. ANALYTICS

Track:

```text
AI requests
AI tokens
AI cost
Workflow executions
Workflow success rate
Workflow failures
Agent runs
Tool calls
Tasks completed
Leads processed
Emails generated
Appointments
Estimated time saved
```

Dashboard should translate technical metrics into business value.

Example:

Instead of only:

```text
12,490 AI tokens
```

also show:

```text
Estimated 18.5 hours saved
```

---

# 27. AI COST TRACKING

Every AI request should track:

```text
workspace
agent
workflow
execution
user
provider
model
input tokens
output tokens
total tokens
estimated cost
latency
status
timestamp
```

Never hard-code AI pricing into UI.

Use a provider/model pricing configuration.

---

# 28. BILLING

Use Stripe.

Plans:

```text
Free
Starter
Business
Pro
Enterprise
```

Example pricing:

```text
Starter    $49/month
Business   $149/month
Pro        $399/month
Enterprise Custom
```

These are initial examples only.

Billing should support:

```text
subscription
monthly/yearly
Stripe customer
Stripe subscription
payments
usage limits
plan limits
```

Do not hard-code pricing throughout the application.

Store plans/configuration centrally.

---

# 29. USAGE LIMITS

Potential limits:

```text
AI requests
AI tokens
Workflow executions
Agents
Knowledge storage
Team members
Integrations
Customers
```

Before expensive operations:

```text
Check Workspace Plan
        ↓
Check Usage
        ↓
Allow / Reject / Upgrade
```

---

# 30. AUDIT LOGGING

Record important actions:

```text
Agent created
Agent activated
Workflow created
Workflow published
Workflow executed
Tool executed
Approval requested
Approval approved
Approval rejected
Integration connected
Customer modified
Billing changed
Permission changed
```

Record:

```text
actor
action
resource
old values
new values
IP
user agent
timestamp
metadata
```

AI actions must be distinguishable from human actions.

---

# 31. API

Use typed APIs.

For external/public API, support:

```text
/api/v1/agents
/api/v1/workflows
/api/v1/customers
/api/v1/tasks
/api/v1/conversations
/api/v1/knowledge
/api/v1/integrations
```

Use API keys for external customers.

Never expose internal database queries directly.

---

# 32. GRAPHQL

GraphQL may be used for complex dashboard data if beneficial.

If GraphQL is implemented:

```text
React
 ↓
GraphQL Client
 ↓
Next.js GraphQL endpoint
 ↓
Services
 ↓
Database
```

Do not make GraphQL mandatory for every operation.

Use normal route handlers for:

```text
OAuth callbacks
Webhooks
File uploads
Streaming
Provider callbacks
```

The application should use a service/domain layer underneath the API so GraphQL and REST never duplicate business logic.

---

# 33. PROJECT STRUCTURE

Use a modular structure.

Example:

```text
src/
  app/
    (auth)/
    (dashboard)/
    api/

  components/
    ui/
    dashboard/
    agents/
    workflows/
    customers/
    conversations/
    knowledge/

  features/
    agents/
    workflows/
    customers/
    conversations/
    knowledge/
    integrations/
    billing/

  server/
    ai/
    agents/
    workflows/
    knowledge/
    integrations/
    customers/
    conversations/
    billing/
    permissions/
    audit/

  lib/
    db/
    auth/
    stripe/
    redis/
    validation/

  types/

  config/
```

Keep domain logic out of UI components.

---

# 34. VALIDATION

Use Zod for:

* form validation
* API input
* tool inputs
* workflow configuration
* AI structured outputs
* integration configuration

Never trust AI-generated JSON without validation.

---

# 35. SECURITY

Implement:

* authentication
* authorization
* workspace isolation
* CSRF protection where applicable
* rate limiting
* secure cookies
* encrypted credentials
* input validation
* output validation
* file type validation
* file size limits
* SQL injection protection
* XSS protection
* webhook signature validation
* audit logging

Never trust:

```text
client workspaceId
AI permission decisions
AI-generated tool arguments
URL redirects
uploaded files
webhook payloads
```

---

# 36. FILE STORAGE

Do not store large uploaded documents directly in PostgreSQL.

Use object storage such as:

```text
Vercel Blob
S3
Cloudflare R2
Supabase Storage
```

Database stores:

```text
file path
file name
mime type
size
metadata
```

---

# 37. ERROR HANDLING

Every background operation must support:

```text
retry
backoff
failure
timeout
cancel
fallback
human approval
```

Never silently swallow errors.

User-facing errors should be understandable.

Developer logs should contain detailed technical information.

---

# 38. OBSERVABILITY

Track:

```text
request duration
AI latency
workflow duration
tool duration
database errors
integration failures
workflow failures
AI failures
```

Add structured logging.

Do not log:

```text
passwords
OAuth tokens
API keys
raw secrets
sensitive credentials
```

---

# 39. AI-GENERATED WORKFLOWS

One of the most important features.

User can type:

```text
"When a new lead submits our website form,
qualify them using our company knowledge,
create a customer,
send a personalized email,
and create a follow-up task."
```

AI should generate a workflow draft.

Example:

```text
Webhook Trigger
 ↓
AI Qualification
 ↓
Create Customer
 ↓
Send Email
 ↓
Create Task
```

The AI must NEVER automatically activate the generated workflow.

Required flow:

```text
Natural Language
 ↓
AI generates workflow
 ↓
Validate schema
 ↓
Display visual draft
 ↓
User reviews
 ↓
User edits
 ↓
User activates
```

---

# 40. AI WORKFLOW GENERATION

Use a strict structured schema.

Example:

```ts
type GeneratedWorkflow = {
    name: string;
    description: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
};
```

Validate with Zod.

Reject invalid workflows.

---

# 41. TEMPLATES

Initial templates:

```text
AI Lead Qualification

AI Sales Follow-up

AI Customer Support

AI Appointment Booking

AI RFQ Processing

AI Quote Generation

AI Invoice Processing

AI Website Lead Management

AI E-commerce Support

AI Recruitment Screening
```

Templates should create configurable agents/workflows rather than hard-coded special cases.

---

# 42. NOTIFICATIONS

Support:

```text
In-app
Email
```

Later:

```text
Slack
WhatsApp
SMS
```

Notify users when:

```text
Approval required
Workflow failed
Agent completed important task
Integration disconnected
Usage limit approaching
Payment failed
```

---

# 43. PERFORMANCE

Use:

* database indexes
* pagination
* cursor pagination where useful
* caching
* Redis
* background processing
* lazy loading
* server components
* optimized queries
* batch operations

Never load thousands of records into the browser unnecessarily.

---

# 44. TESTING

Use automated tests.

Test:

```text
Authentication
Workspace isolation
Permissions
Agent creation
Agent execution
Tool permissions
Approval system
Workflow execution
Workflow versioning
Knowledge search
Customer CRUD
Integration authentication
Billing
Usage limits
Webhook verification
AI structured output
```

Critical security tests must verify that one workspace cannot access another workspace's data.

---

# 45. DEVELOPMENT RULE

Do NOT generate the entire application in one giant implementation.

Build incrementally.

Each feature must be:

```text
Database
 ↓
Server logic
 ↓
Validation
 ↓
API
 ↓
UI
 ↓
Tests
```

Before changing existing code:

1. Inspect the project.
2. Understand the current architecture.
3. Reuse existing components.
4. Avoid duplicate functionality.
5. Make the smallest correct change.

Do not install packages unnecessarily.

---

# 46. MVP SCOPE

MVP must include:

```text
Authentication

Multi-tenancy

Workspace creation/switching

Dashboard

AI Agents

Agent Tools

OpenAI integration

Knowledge Base

RAG

Workflow Builder

Workflow Execution

Human Approval

Tasks

Customers

Conversations

Gmail

Webhook

HTTP Request

Audit Logs

AI Usage

Stripe Billing
```

Do NOT initially build:

```text
100+ integrations
Mobile apps
Enterprise SSO
Kubernetes
Microservices
Voice AI
Fine-tuning
Complex ML
Marketplace
Full CRM replacement
Full accounting system
```

---

# 47. IMPLEMENTATION PHASES

## Phase 1 — Foundation

Build:

```text
Next.js
TypeScript
Tailwind
shadcn/ui
PostgreSQL
Prisma
Authentication
Workspace
Users
Roles
Dashboard shell
```

Do not build AI yet.

---

## Phase 2 — Agents

Build:

```text
Agents
Agent configuration
Agent instructions
AI provider abstraction
OpenAI
Tool registry
Agent runs
AI usage tracking
```

---

## Phase 3 — Knowledge

Build:

```text
File upload
Document extraction
Chunking
Embeddings
pgvector
Semantic search
Agent knowledge
RAG
```

---

## Phase 4 — Workflow Engine

Build:

```text
React Flow
Nodes
Connections
Workflow versions
Execution engine
Execution logs
Retries
Conditions
AI nodes
Actions
```

---

## Phase 5 — Human Approval

Build:

```text
Approval rules
Approval tasks
Approve
Reject
Resume execution
Audit logs
```

---

## Phase 6 — Business Features

Build:

```text
Customers
Conversations
Tasks
Email
Calendar
Webhooks
REST API
```

---

## Phase 7 — Integrations

Build:

```text
Gmail
Google Calendar
Slack
HubSpot
Shopify
WooCommerce
```

---

## Phase 8 — Monetization

Build:

```text
Stripe
Plans
Subscriptions
Usage limits
Billing dashboard
Upgrade flows
```

---

# 48. FIRST DEVELOPMENT TASK

Do ONLY the foundation.

Create:

```text
Next.js project
TypeScript
Tailwind
shadcn/ui
PostgreSQL
Prisma
Authentication
Users
Workspaces
Workspace membership
Roles
Dashboard layout
Sidebar
Workspace switcher
User profile
```

Create migrations/models for:

```text
users
workspaces
workspace_users
roles
permissions
role_permissions
```

Implement:

```text
Register
Login
Logout
Create workspace
Switch workspace
Workspace authorization
```

Create a basic dashboard.

Do NOT implement AI agents, workflows, RAG, billing, or integrations in the first task.

---

# 49. CODE QUALITY

Use:

* strict TypeScript
* reusable components
* server-side authorization
* typed database queries
* Zod validation
* clear domain boundaries
* environment variables
* clean error handling
* automated tests

Avoid:

* `any` unless genuinely unavoidable
* giant components
* duplicated business logic
* database access inside random UI components
* secrets in client code
* hard-coded workspace IDs
* hard-coded API keys
* hard-coded pricing
* hard-coded AI provider logic

---

# 50. ENVIRONMENT VARIABLES

Use environment variables for:

```text
DATABASE_URL
DIRECT_URL

AUTH_SECRET

OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_AI_API_KEY

REDIS_URL

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

BLOB_STORAGE credentials

EMAIL credentials
```

Never commit secrets.

Provide `.env.example`.

---

# 51. FINAL ARCHITECTURE

The final architecture should be:

```text
                         VERCEL
                           │
                           ▼
                    ┌─────────────┐
                    │   Next.js   │
                    │ React + TS  │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Agents       Workflows      Customers
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    Domain Services
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
             AI          RAG        Integrations
              │            │            │
              ▼            ▼            ▼
          AI Models    pgvector     External APIs
                           │
                           ▼
                     PostgreSQL
                           │
                           ▼
                         Redis
                           │
                           ▼
                        Stripe
```

---

# 52. MOST IMPORTANT RULE

Build a real business automation platform, not an AI demo.

Every feature should answer:

**"What business work does this save the customer from doing manually?"**

The product should eventually allow:

```text
Business owner
      ↓
Describe business goal
      ↓
AI creates agent/workflow
      ↓
User reviews
      ↓
Activate
      ↓
AI performs work
      ↓
Human approves sensitive actions
      ↓
Business gets result
      ↓
Platform measures ROI
```

This is the central product experience.
