# COMPLETE DATABASE SCHEMA

## AI Business Agent Platform

Database:

**PostgreSQL 16+**

ORM:

**Prisma**

Vector extension:

**pgvector**

The schema is designed for:

* Next.js
* TypeScript
* Vercel
* PostgreSQL
* Prisma
* AI SDK
* Redis
* Stripe
* Multi-tenant SaaS

---

# 1. DATABASE RELATIONSHIP MAP

```text
USER
 │
 ├── WORKSPACE_USER
 │        │
 │        └── WORKSPACE
 │              │
 │     ┌────────┼──────────┬───────────┐
 │     │        │          │           │
 ▼     ▼        ▼          ▼           ▼
AGENTS WORKFLOWS CUSTOMERS KNOWLEDGE INTEGRATIONS
 │       │          │          │
 │       │          │          └── DOCUMENTS
 │       │          │                └── CHUNKS
 │       │          │
 │       │          └── CONVERSATIONS
 │       │                    └── MESSAGES
 │       │
 │       └── VERSIONS
 │              ├── NODES
 │              ├── CONNECTIONS
 │              └── EXECUTIONS
 │                       └── EXECUTION STEPS
 │
 ├── AGENT TOOLS
 ├── AGENT RUNS
 └── APPROVALS

WORKSPACE
 │
 ├── TASKS
 ├── AUDIT LOGS
 ├── AI REQUESTS
 ├── USAGE
 ├── BILLING
 └── API KEYS
```

---

# 2. USERS

```prisma
model User {
  id              String    @id @default(uuid())
  name            String
  email           String    @unique
  emailVerifiedAt DateTime?
  passwordHash    String?
  avatarUrl       String?
  timezone        String    @default("UTC")
  locale          String    @default("en")
  lastLoginAt     DateTime?

  workspaceUsers  WorkspaceUser[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([email])
}
```

If using an external authentication provider, `passwordHash` can be nullable.

---

# 3. WORKSPACES

A workspace represents a business.

```prisma
model Workspace {
  id                    String   @id @default(uuid())

  name                  String
  slug                  String   @unique

  logoUrl               String?
  websiteUrl            String?

  industry              String?
  companySize           String?

  email                 String?
  phone                 String?

  addressLine1          String?
  addressLine2          String?
  city                  String?
  state                 String?
  postalCode            String?
  country               String?

  timezone              String   @default("UTC")
  currency              String   @default("USD")

  status                String   @default("active")

  onboardingCompletedAt DateTime?

  users                 WorkspaceUser[]
  agents                Agent[]
  workflows             Workflow[]
  tasks                 Task[]
  customers             Customer[]
  conversations         Conversation[]

  knowledgeSources      KnowledgeSource[]
  integrations          IntegrationConnection[]
  webhooks              Webhook[]

  aiRequests            AiRequest[]
  usageRecords          UsageRecord[]

  notifications         Notification[]
  auditLogs             AuditLog[]

  apiKeys               ApiKey[]

  subscriptions         Subscription[]
  payments              Payment[]

  scheduledJobs         ScheduledJob[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

---

# 4. WORKSPACE USERS

```prisma
model WorkspaceUser {
  id          String   @id @default(uuid())

  workspaceId String
  userId      String

  role        String   @default("member")
  status      String   @default("active")

  joinedAt    DateTime?
  lastActiveAt DateTime?

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([workspaceId, userId])
  @@index([workspaceId])
  @@index([userId])
}
```

Roles:

```text
owner
admin
manager
member
viewer
```

---

# 5. ROLES

```prisma
model Role {
  id          String   @id @default(uuid())

  workspaceId String?
  name        String
  slug        String

  description String?
  isSystem    Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([workspaceId])
}
```

---

# 6. PERMISSIONS

```prisma
model Permission {
  id          String   @id @default(uuid())

  name        String
  slug        String   @unique
  description String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# 7. ROLE PERMISSIONS

```prisma
model RolePermission {
  roleId       String
  permissionId String

  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}
```

---

# 8. AGENTS

```prisma
model Agent {
  id                  String   @id @default(uuid())

  workspaceId         String

  name                String
  slug                String
  description         String?
  purpose             String?
  systemInstructions  String?

  provider            String   @default("openai")
  model               String

  temperature         Decimal? @db.Decimal(3, 2)
  maxSteps            Int      @default(10)

  status              String   @default("draft")

  avatarUrl           String?

  settings            Json?

  activatedAt         DateTime?

  createdById         String?

  workspace           Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  tools               AgentTool[]
  approvalRules       AgentApprovalRule[]
  knowledge           AgentKnowledge[]

  runs                AgentRun[]
  tasks               Task[]
  conversations       Conversation[]

  aiRequests          AiRequest[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@unique([workspaceId, slug])
  @@index([workspaceId])
  @@index([workspaceId, status])
}
```

---

# 9. AGENT TOOLS

```prisma
model AgentTool {
  id                String   @id @default(uuid())

  agentId           String

  toolType          String
  toolName          String
  description       String?

  configuration     Json?

  permissionLevel   String   @default("read")

  requiresApproval  Boolean  @default(false)
  enabled           Boolean  @default(true)

  agent             Agent    @relation(fields: [agentId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([agentId])
}
```

---

# 10. AGENT APPROVAL RULES

```prisma
model AgentApprovalRule {
  id                    String   @id @default(uuid())

  workspaceId           String
  agentId               String

  actionType            String
  description           String?

  enabled               Boolean  @default(true)

  approvalTimeoutMinutes Int     @default(1440)

  approverRole          String?

  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  agent                 Agent     @relation(fields: [agentId], references: [id], onDelete: Cascade)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([agentId])
}
```

---

# 11. KNOWLEDGE SOURCES

```prisma
model KnowledgeSource {
  id              String   @id @default(uuid())

  workspaceId     String

  name            String
  type            String

  sourceUrl       String?
  filePath        String?

  mimeType        String?
  fileSize        BigInt?

  status          String   @default("pending")

  metadata        Json?

  createdById     String?

  processedAt     DateTime?

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  documents       KnowledgeDocument[]
  agents          AgentKnowledge[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([workspaceId])
  @@index([workspaceId, status])
}
```

Types:

```text
pdf
docx
txt
csv
xlsx
url
manual
faq
```

---

# 12. KNOWLEDGE DOCUMENTS

```prisma
model KnowledgeDocument {
  id                String   @id @default(uuid())

  workspaceId       String
  knowledgeSourceId String

  title             String

  content           String?

  language          String   @default("en")

  status            String   @default("pending")

  metadata          Json?

  tokenCount        Int?

  source            KnowledgeSource @relation(fields: [knowledgeSourceId], references: [id], onDelete: Cascade)

  chunks            KnowledgeChunk[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([workspaceId])
  @@index([knowledgeSourceId])
}
```

---

# 13. KNOWLEDGE CHUNKS

Use pgvector.

```prisma
model KnowledgeChunk {
  id          String   @id @default(uuid())

  workspaceId String
  documentId  String

  chunkIndex  Int

  content     String

  tokenCount  Int?

  metadata    Json?

  document    KnowledgeDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([workspaceId])
  @@index([documentId])
}
```

The vector field may require a Prisma unsupported type depending on the Prisma version:

```prisma
embedding Unsupported("vector(1536)")?
```

Do not assume `1536` permanently. Choose the dimension according to the embedding model.

---

# 14. AGENT KNOWLEDGE

```prisma
model AgentKnowledge {
  id                String   @id @default(uuid())

  agentId           String
  knowledgeSourceId String

  priority          Int      @default(0)
  enabled           Boolean  @default(true)

  agent             Agent           @relation(fields: [agentId], references: [id], onDelete: Cascade)
  source            KnowledgeSource @relation(fields: [knowledgeSourceId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())

  @@unique([agentId, knowledgeSourceId])
}
```

---

# 15. WORKFLOWS

```prisma
model Workflow {
  id              String   @id @default(uuid())

  workspaceId     String

  name            String
  slug            String

  description     String?

  status          String   @default("draft")

  triggerType     String?

  activeVersionId String?

  createdById     String?

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  versions        WorkflowVersion[]
  executions      WorkflowExecution[]

  scheduledJobs   ScheduledJob[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([workspaceId, slug])
  @@index([workspaceId])
}
```

---

# 16. WORKFLOW VERSIONS

```prisma
model WorkflowVersion {
  id          String   @id @default(uuid())

  workflowId  String

  version     Int

  status      String   @default("draft")

  createdById String?

  publishedAt DateTime?

  workflow    Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  nodes       WorkflowNode[]
  connections WorkflowConnection[]

  executions  WorkflowExecution[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([workflowId, version])
  @@index([workflowId])
}
```

---

# 17. WORKFLOW NODES

```prisma
model WorkflowNode {
  id                String   @id @default(uuid())

  workflowVersionId String

  nodeKey           String
  nodeType          String

  name              String

  positionX         Decimal? @db.Decimal(12, 4)
  positionY         Decimal? @db.Decimal(12, 4)

  configuration     Json?

  workflowVersion   WorkflowVersion @relation(fields: [workflowVersionId], references: [id], onDelete: Cascade)

  outgoingConnections WorkflowConnection[] @relation("SourceNode")
  incomingConnections WorkflowConnection[] @relation("TargetNode")

  executionSteps    WorkflowExecutionStep[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([workflowVersionId, nodeKey])
  @@index([workflowVersionId])
}
```

---

# 18. WORKFLOW CONNECTIONS

```prisma
model WorkflowConnection {
  id                String   @id @default(uuid())

  workflowVersionId String

  sourceNodeId      String
  targetNodeId      String

  sourceHandle      String?
  targetHandle      String?

  condition         Json?

  workflowVersion   WorkflowVersion @relation(fields: [workflowVersionId], references: [id], onDelete: Cascade)

  sourceNode        WorkflowNode @relation("SourceNode", fields: [sourceNodeId], references: [id], onDelete: Cascade)

  targetNode        WorkflowNode @relation("TargetNode", fields: [targetNodeId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())

  @@index([workflowVersionId])
  @@index([sourceNodeId])
  @@index([targetNodeId])
}
```

---

# 19. WORKFLOW EXECUTIONS

```prisma
model WorkflowExecution {
  id                  String   @id @default(uuid())

  workspaceId         String

  workflowId          String
  workflowVersionId   String

  triggeredByUserId   String?

  triggerData         Json?

  status              String   @default("pending")

  currentNodeId      String?

  startedAt           DateTime?
  completedAt         DateTime?

  errorMessage        String?

  totalDurationMs     BigInt?

  workspace           Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  workflow            Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  workflowVersion     WorkflowVersion @relation(fields: [workflowVersionId], references: [id], onDelete: Cascade)

  steps               WorkflowExecutionStep[]

  agentRuns           AgentRun[]

  tasks               Task[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([workspaceId])
  @@index([workspaceId, status])
  @@index([workspaceId, createdAt])
}
```

---

# 20. WORKFLOW EXECUTION STEPS

```prisma
model WorkflowExecutionStep {
  id           String   @id @default(uuid())

  executionId  String
  nodeId       String

  status       String   @default("pending")

  inputData    Json?
  outputData   Json?

  errorMessage String?

  attempt      Int      @default(1)

  startedAt    DateTime?
  completedAt  DateTime?

  durationMs   BigInt?

  execution    WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  node         WorkflowNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([executionId])
  @@index([nodeId])
}
```

---

# 21. TASKS

```prisma
model Task {
  id                    String   @id @default(uuid())

  workspaceId           String

  title                 String
  description           String?

  status                String   @default("pending")
  priority              String   @default("normal")

  assignedToId          String?
  agentId               String?
  workflowExecutionId   String?

  dueAt                 DateTime?
  completedAt           DateTime?

  metadata              Json?

  createdById           String?

  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  agent                 Agent? @relation(fields: [agentId], references: [id], onDelete: SetNull)

  workflowExecution     WorkflowExecution? @relation(fields: [workflowExecutionId], references: [id], onDelete: SetNull)

  approvals             TaskApproval[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([workspaceId, status])
  @@index([workspaceId, assignedToId])
}
```

---

# 22. TASK APPROVALS

```prisma
model TaskApproval {
  id                    String   @id @default(uuid())

  workspaceId           String

  taskId                String

  requestedByAgentId    String?

  requestedAction       String

  requestData           Json?

  status                String   @default("pending")

  reviewedById          String?
  reviewedAt            DateTime?

  reviewerComment       String?

  expiresAt             DateTime?

  task                  Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([taskId])
  @@index([workspaceId, status])
}
```

---

# 23. CUSTOMERS

```prisma
model Customer {
  id                String   @id @default(uuid())

  workspaceId       String

  firstName         String?
  lastName          String?

  companyName       String?

  email             String?
  phone             String?

  websiteUrl        String?

  status            String   @default("lead")

  leadScore         Int      @default(0)

  source            String?

  assignedToId      String?
  assignedAgentId   String?

  address           Json?

  tags              Json?
  customFields      Json?

  lastContactedAt   DateTime?

  workspace         Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  conversations     Conversation[]
  notes             CustomerNote[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([workspaceId])
  @@index([workspaceId, email])
  @@index([workspaceId, status])
}
```

---

# 24. CUSTOMER NOTES

```prisma
model CustomerNote {
  id          String   @id @default(uuid())

  workspaceId String
  customerId  String

  userId      String?

  content     String

  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([workspaceId])
  @@index([customerId])
}
```

---

# 25. CONVERSATIONS

```prisma
model Conversation {
  id                String   @id @default(uuid())

  workspaceId       String

  customerId        String?
  agentId           String?

  channel           String

  subject           String?

  status            String   @default("open")

  assignedToId      String?

  externalId        String?

  metadata          Json?

  lastMessageAt     DateTime?

  workspace         Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  customer          Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)

  agent             Agent? @relation(fields: [agentId], references: [id], onDelete: SetNull)

  messages          ConversationMessage[]

  agentRuns         AgentRun[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([workspaceId])
  @@index([customerId])
  @@index([workspaceId, status])
}
```

---

# 26. CONVERSATION MESSAGES

```prisma
model ConversationMessage {
  id                  String   @id @default(uuid())

  workspaceId         String

  conversationId      String

  senderType          String
  senderId            String?

  messageType         String   @default("text")

  content             String?

  attachments         Json?

  externalMessageId   String?

  aiGenerated         Boolean  @default(false)

  agentId             String?

  metadata            Json?

  sentAt              DateTime?

  conversation        Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  createdAt           DateTime @default(now())

  @@index([workspaceId])
  @@index([conversationId])
  @@index([conversationId, createdAt])
}
```

---

# 27. INTEGRATIONS

Global integration definitions.

```prisma
model Integration {
  id                   String   @id @default(uuid())

  name                 String
  slug                 String   @unique

  provider             String

  description          String?

  category             String?

  authenticationType  String

  configuration        Json?

  isActive             Boolean  @default(true)

  connections           IntegrationConnection[]

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

---

# 28. INTEGRATION CONNECTIONS

```prisma
model IntegrationConnection {
  id                  String   @id @default(uuid())

  workspaceId         String
  integrationId       String

  name                String

  status              String   @default("connected")

  externalAccountId   String?

  credentials         Json?

  configuration       Json?

  lastSyncedAt        DateTime?
  expiresAt           DateTime?

  createdById         String?

  workspace            Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  integration          Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([workspaceId])
  @@index([integrationId])
}
```

Credentials must be encrypted at application level.

---

# 29. WEBHOOKS

```prisma
model Webhook {
  id              String   @id @default(uuid())

  workspaceId     String

  name            String

  direction       String

  url             String

  secret          String?

  eventTypes      Json?

  status          String   @default("active")

  lastTriggeredAt DateTime?

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  deliveries      WebhookDelivery[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([workspaceId])
}
```

---

# 30. WEBHOOK DELIVERIES

```prisma
model WebhookDelivery {
  id              String   @id @default(uuid())

  webhookId       String

  eventType       String

  payload         Json

  responseStatus  Int?
  responseBody    String?

  attempt         Int      @default(1)

  status          String   @default("pending")

  sentAt          DateTime?

  webhook         Webhook @relation(fields: [webhookId], references: [id], onDelete: Cascade)

  createdAt       DateTime @default(now())

  @@index([webhookId])
}
```

---

# 31. AI REQUESTS

```prisma
model AiRequest {
  id                    String   @id @default(uuid())

  workspaceId           String

  agentId               String?
  workflowId            String?
  workflowExecutionId   String?

  userId                String?

  provider              String
  model                 String

  requestType           String?

  inputTokens           Int      @default(0)
  outputTokens          Int      @default(0)
  totalTokens           Int      @default(0)

  estimatedCost         Decimal  @default(0) @db.Decimal(12, 6)

  latencyMs             BigInt?

  status                String   @default("completed")

  requestMetadata      Json?

  errorMessage         String?

  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  agent                 Agent? @relation(fields: [agentId], references: [id], onDelete: SetNull)

  toolCalls             AiToolCall[]

  createdAt             DateTime @default(now())

  @@index([workspaceId])
  @@index([agentId])
  @@index([workspaceId, createdAt])
}
```

---

# 32. AI TOOL CALLS

```prisma
model AiToolCall {
  id                 String   @id @default(uuid())

  workspaceId        String

  aiRequestId        String

  agentId            String?

  toolName           String

  inputData          Json?
  outputData         Json?

  status             String   @default("completed")

  requiresApproval   Boolean  @default(false)

  approved           Boolean?

  durationMs         BigInt?

  errorMessage       String?

  request            AiRequest @relation(fields: [aiRequestId], references: [id], onDelete: Cascade)

  createdAt          DateTime @default(now())

  @@index([workspaceId])
  @@index([aiRequestId])
}
```

---

# 33. AGENT RUNS

```prisma
model AgentRun {
  id                    String   @id @default(uuid())

  workspaceId           String

  agentId               String

  userId                String?

  conversationId        String?

  workflowExecutionId   String?

  input                 String?
  output                String?

  status                String   @default("running")

  steps                 Int      @default(0)

  startedAt             DateTime?
  completedAt           DateTime?

  errorMessage          String?

  agent                 Agent @relation(fields: [agentId], references: [id], onDelete: Cascade)

  conversation          Conversation? @relation(fields: [conversationId], references: [id], onDelete: SetNull)

  workflowExecution     WorkflowExecution? @relation(fields: [workflowExecutionId], references: [id], onDelete: SetNull)

  stepsData             AgentRunStep[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([agentId])
  @@index([conversationId])
}
```

---

# 34. AGENT RUN STEPS

```prisma
model AgentRunStep {
  id           String   @id @default(uuid())

  agentRunId   String

  stepNumber   Int

  stepType     String

  inputData    Json?
  outputData   Json?

  toolName     String?

  status       String   @default("completed")

  durationMs   BigInt?

  agentRun     AgentRun @relation(fields: [agentRunId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now())

  @@index([agentRunId])
}
```

---

# 35. USAGE RECORDS

```prisma
model UsageRecord {
  id            String   @id @default(uuid())

  workspaceId   String

  metric        String

  quantity      Decimal  @default(0) @db.Decimal(15, 4)

  periodStart   DateTime
  periodEnd     DateTime

  metadata      Json?

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())

  @@index([workspaceId])
  @@index([workspaceId, metric])
  @@index([workspaceId, periodStart])
}
```

---

# 36. PLANS

```prisma
model Plan {
  id                    String   @id @default(uuid())

  name                  String
  slug                  String   @unique

  description           String?

  monthlyPrice          Decimal  @db.Decimal(10, 2)
  yearlyPrice           Decimal? @db.Decimal(10, 2)

  stripeProductId       String?
  stripeMonthlyPriceId  String?
  stripeYearlyPriceId   String?

  limits                Json?
  features              Json?

  isActive              Boolean  @default(true)

  subscriptions         Subscription[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

---

# 37. SUBSCRIPTIONS

```prisma
model Subscription {
  id                    String   @id @default(uuid())

  workspaceId           String
  planId                String

  stripeCustomerId      String?
  stripeSubscriptionId  String?

  status                String

  billingInterval       String   @default("monthly")

  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?

  cancelAtPeriodEnd    Boolean  @default(false)

  cancelledAt          DateTime?

  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  plan                  Plan @relation(fields: [planId], references: [id])

  payments              Payment[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([stripeSubscriptionId])
}
```

---

# 38. PAYMENTS

```prisma
model Payment {
  id                    String   @id @default(uuid())

  workspaceId           String
  subscriptionId        String?

  stripePaymentIntentId String?
  stripeInvoiceId       String?

  amount                Decimal  @db.Decimal(12, 2)

  currency              String   @default("USD")

  status                String

  paidAt                DateTime?

  metadata              Json?

  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  subscription          Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([workspaceId])
  @@index([stripePaymentIntentId])
}
```

---

# 39. NOTIFICATIONS

```prisma
model Notification {
  id          String   @id @default(uuid())

  workspaceId String
  userId      String

  type        String

  title       String
  message     String?

  data        Json?

  readAt      DateTime?

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([workspaceId])
  @@index([userId])
  @@index([userId, readAt])
}
```

---

# 40. AUDIT LOGS

```prisma
model AuditLog {
  id              String   @id @default(uuid())

  workspaceId     String

  userId          String?

  actorType       String

  action          String

  resourceType    String?
  resourceId      String?

  oldValues       Json?
  newValues       Json?

  ipAddress       String?
  userAgent       String?

  metadata        Json?

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  createdAt       DateTime @default(now())

  @@index([workspaceId])
  @@index([workspaceId, createdAt])
  @@index([resourceType, resourceId])
}
```

Actor types:

```text
user
agent
system
webhook
api
```

---

# 41. TEMPLATES

```prisma
model Template {
  id             String   @id @default(uuid())

  name           String
  slug           String   @unique

  description    String?

  category       String?

  type           String

  icon           String?

  configuration  Json

  isFeatured     Boolean  @default(false)
  isActive       Boolean  @default(true)

  installations  WorkspaceTemplate[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

# 42. WORKSPACE TEMPLATES

```prisma
model WorkspaceTemplate {
  id           String   @id @default(uuid())

  workspaceId  String
  templateId   String

  installedById String?

  installedAt  DateTime @default(now())

  template     Template @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, templateId])
  @@index([workspaceId])
}
```

---

# 43. API KEYS

```prisma
model ApiKey {
  id          String   @id @default(uuid())

  workspaceId String

  name        String

  keyPrefix   String

  keyHash     String

  lastUsedAt  DateTime?

  expiresAt   DateTime?

  revokedAt   DateTime?

  createdById String?

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([workspaceId])
  @@index([keyHash])
}
```

Never store the raw API key.

---

# 44. SCHEDULED JOBS

```prisma
model ScheduledJob {
  id              String   @id @default(uuid())

  workspaceId     String

  workflowId      String

  cronExpression  String

  timezone        String   @default("UTC")

  enabled         Boolean  @default(true)

  nextRunAt       DateTime?
  lastRunAt       DateTime?

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  workflow        Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([workspaceId])
  @@index([workflowId])
  @@index([enabled, nextRunAt])
}
```

---

# 45. RECOMMENDED ENUMS

Use application/database enums where practical.

## AgentStatus

```text
DRAFT
TESTING
ACTIVE
PAUSED
ARCHIVED
```

## WorkflowStatus

```text
DRAFT
ACTIVE
PAUSED
ARCHIVED
```

## ExecutionStatus

```text
PENDING
RUNNING
WAITING
COMPLETED
FAILED
CANCELLED
```

## ApprovalStatus

```text
PENDING
APPROVED
REJECTED
EXPIRED
CANCELLED
```

## TaskStatus

```text
PENDING
IN_PROGRESS
WAITING_APPROVAL
COMPLETED
FAILED
CANCELLED
```

---

# 46. INITIAL INTEGRATIONS

Seed:

```text
Gmail
Google Calendar
Slack
HubSpot
Shopify
WooCommerce
Stripe
SMTP
REST API
Webhook
```

---

# 47. INITIAL TEMPLATES

Seed:

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

---

# 48. INITIAL ROLES

Seed:

```text
Owner
Admin
Manager
Member
Viewer
```

---

# 49. INITIAL PERMISSIONS

Seed:

```text
agents.view
agents.create
agents.update
agents.delete
agents.execute

workflows.view
workflows.create
workflows.update
workflows.delete
workflows.execute
workflows.publish

customers.view
customers.create
customers.update
customers.delete

conversations.view
conversations.manage

knowledge.view
knowledge.upload
knowledge.update
knowledge.delete

integrations.view
integrations.manage

tasks.view
tasks.create
tasks.update
tasks.approve

analytics.view

audit.view

billing.view
billing.manage

settings.view
settings.manage
```

---

# 50. VECTOR SEARCH

Enable:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Create the vector index according to the embedding model and dataset size.

For example:

```sql
CREATE INDEX knowledge_chunks_embedding_idx
ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops);
```

Do not blindly create an index before testing the actual embedding/search workload.

---

# 51. MULTI-TENANT DATABASE RULE

Every tenant-owned table must have:

```text
workspaceId
```

Examples:

```text
Agent
Workflow
Task
Customer
Conversation
KnowledgeSource
IntegrationConnection
Webhook
AiRequest
UsageRecord
AuditLog
Subscription
Payment
ApiKey
```

Every server-side query must verify:

```text
authenticated user
        ↓
workspace membership
        ↓
workspace ID
        ↓
resource ownership
```

---

# 52. SECURITY RULE

Never trust:

```text
workspaceId
userId
role
permissions
agent permissions
tool permissions
AI output
AI-generated SQL
AI-generated URLs
client-side approval state
```

All sensitive authorization must happen server-side.

---

# 53. AI SECURITY RULE

The AI may request:

```text
send_email
create_customer
update_customer
refund
delete
create_quote
```

but it cannot execute the action directly.

Always:

```text
AI
 ↓
Tool Registry
 ↓
Input Validation
 ↓
Permission Check
 ↓
Workspace Check
 ↓
Approval Rule
 ↓
Human Approval if required
 ↓
Tool Execution
```

---

# 54. MVP TABLE SET

Implement these first:

```text
User
Workspace
WorkspaceUser

Agent
AgentTool
AgentApprovalRule

KnowledgeSource
KnowledgeDocument
KnowledgeChunk
AgentKnowledge

Workflow
WorkflowVersion
WorkflowNode
WorkflowConnection
WorkflowExecution
WorkflowExecutionStep

Task
TaskApproval

Customer
CustomerNote

Conversation
ConversationMessage

Integration
IntegrationConnection

AiRequest
AiToolCall
AgentRun
AgentRunStep

AuditLog
UsageRecord

Plan
Subscription
Payment
```

Add:

```text
Webhooks
API keys
Templates
ScheduledJobs
Notifications
```

incrementally.

---

# 55. MIGRATION ORDER

Create migrations in this order:

```text
01 users

02 workspaces
03 workspace_users

04 roles
05 permissions
06 role_permissions

07 agents
08 agent_tools
09 agent_approval_rules

10 knowledge_sources
11 knowledge_documents
12 knowledge_chunks
13 agent_knowledge

14 workflows
15 workflow_versions
16 workflow_nodes
17 workflow_connections
18 workflow_executions
19 workflow_execution_steps

20 tasks
21 task_approvals

22 customers
23 customer_notes

24 conversations
25 conversation_messages

26 integrations
27 integration_connections

28 webhooks
29 webhook_deliveries

30 agent_runs
31 agent_run_steps

32 ai_requests
33 ai_tool_calls

34 usage_records

35 notifications
36 audit_logs

37 templates
38 workspace_templates

39 api_keys
40 scheduled_jobs

41 plans
42 subscriptions
43 payments
```

---

# 56. DATABASE DESIGN PRINCIPLE

Do not make database design provider-specific.

Do not create:

```text
openai_assistant_id
openai_thread_id
openai_only_x
```

as core business fields.

Instead use:

```text
provider
model
configuration
metadata
```

This allows:

```text
OpenAI
Anthropic
Gemini
Future providers
```

without redesigning the database.

---

# 57. FINAL DATA ARCHITECTURE

```text
                    USER
                     │
                     ▼
                 WORKSPACE
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
      AGENTS      WORKFLOWS    CUSTOMERS
        │            │            │
        │            ▼            ▼
        │        EXECUTIONS   CONVERSATIONS
        │            │            │
        ▼            ▼            ▼
      TOOLS       TASKS       MESSAGES
        │
        ▼
    KNOWLEDGE
        │
        ▼
     DOCUMENTS
        │
        ▼
      CHUNKS
        │
        ▼
    PGVECTOR

WORKSPACE
    │
    ├── INTEGRATIONS
    ├── WEBHOOKS
    ├── AUDIT LOGS
    ├── AI REQUESTS
    ├── USAGE
    └── BILLING
```

This schema is the foundation for the AI Business Agent Platform and should be implemented as a **modular monolith first**, with the option to split AI processing, document processing, workflow execution, or integrations into separate services later if scale requires it.
