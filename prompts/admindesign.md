# AI Business Agent Platform — Updated Admin Panel Design Prompt

Update the existing Framer dashboard design for **orbit / AI** to match the current AI Business Agent Platform architecture.

This is a visual/editable Framer design deliverable, not a working application.

Use the current dashboard visual language:

* Dark SaaS interface
* Inter
* Linear / Vercel / Stripe inspired
* 1440px desktop canvas
* 232px sidebar
* 1208px content area
* 32px content padding
* 16px card radius
* subtle 1px borders
* #0C0D12 canvas
* #101118 sidebar
* #14151D cards
* #F2F3F8 primary text
* #9295A8 muted text
* #262833 borders
* #9180FF accent
* #6960ED → #9060ED primary gradient

Keep all elements editable.

---

# 1. UPDATED ADMIN SIDEBAR

Replace the previous navigation with the navigation from the current AI Business Agent Platform master architecture.

### Brand

```text
orbit / AI
```

### Workspace selector

```text
FORMA STUDIO
Pro workspace
```

### Navigation

Group label:

```text
WORKSPACE
```

Menu items, in this exact order:

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
```

Then a separate lower group:

```text
MANAGEMENT
```

Items:

```text
Team & Roles
Billing
Settings
```

---

# 2. MENU ICONS

Use Lucide icons.

Recommended icons:

```text
Dashboard
→ LayoutDashboard

AI Agents
→ Bot

Automations
→ Workflow

Tasks
→ CheckSquare

Knowledge
→ BookOpen

Customers
→ Users

Conversations
→ MessageSquare

Integrations
→ Plug

Analytics
→ BarChart3

Activity / Logs
→ Activity

Templates
→ Layers

Team & Roles
→ UsersRound

Billing
→ CreditCard

Settings
→ Settings
```

Use consistent 18px icons.

Do not use filled/colorful icons.

Icons should use muted text color by default and primary text color when active.

---

# 3. ACTIVE MENU STATE

The active menu item should have:

```text
background: rgba(145, 128, 255, 0.12)
border-radius: 8px
text: #F2F3F8
icon: #9180FF
```

Do not use a bright full-purple sidebar item.

Keep the active state subtle and premium.

---

# 4. UPDATED TOP BREADCRUMB

Use:

```text
FORMA STUDIO / Dashboard
```

For other screens:

```text
FORMA STUDIO / AI Agents
FORMA STUDIO / Automations
FORMA STUDIO / Tasks
FORMA STUDIO / Knowledge
FORMA STUDIO / Customers
FORMA STUDIO / Conversations
FORMA STUDIO / Integrations
FORMA STUDIO / Analytics
FORMA STUDIO / Activity
FORMA STUDIO / Templates
FORMA STUDIO / Team & Roles
FORMA STUDIO / Billing
FORMA STUDIO / Settings
```

---

# 5. UPDATED SCREEN SET

The admin dashboard should now be designed around these modules.

Create the following presentation screens:

## Screen 01 — Dashboard

Heading:

```text
Your AI workforce at a glance.
```

Subtitle:

```text
Monitor agents, automations, customers, and business activity from one place.
```

Primary action:

```text
Create agent
```

Secondary action:

```text
Create automation
```

KPI cards:

```text
Active agents
12

Running automations
8

Pending approvals
6

Tasks completed
1,284

Leads processed
86

Estimated time saved
142h
```

Additional panels:

```text
Agent performance
Automation activity
Recent conversations
Pending approvals
Recent tasks
AI usage
```

---

# Screen 02 — AI Agents

Heading:

```text
AI Agents
```

Subtitle:

```text
Build, deploy, and manage your AI workforce.
```

Primary action:

```text
Create agent
```

Filters:

```text
All agents
Active
Training
Paused
Archived
```

Cards should show:

```text
Agent name
Purpose
Status
AI model
Connected tools
Channels
Tasks completed
Success rate
Last active
```

Example agents:

```text
Nova
Sales Agent
Active
96.2%

Atlas
Customer Support
Active
94.8%

Luna
Scheduling
Active
98.1%

Scout
Lead Generation
Training

Echo
Customer Success
Paused

Sage
Product Expert
Active
97.6%
```

---

# Screen 03 — Automations

Heading:

```text
Automations
```

Subtitle:

```text
Automate the work between conversations, systems, and AI agents.
```

Primary action:

```text
Create automation
```

Show:

```text
All
Active
Draft
Paused
Failed
```

Automation cards/list:

```text
Inbound Lead Qualification
Active
1,284 runs
97.8% success

Support Escalation
Active
842 runs
96.4% success

Sales Follow-up
Active
526 runs
94.9% success
```

Include a visual workflow preview:

```text
Trigger
 ↓
AI Agent
 ↓
Condition
 ↓
Action
 ↓
Human Approval
```

---

# Screen 04 — Tasks

Heading:

```text
Tasks
```

Subtitle:

```text
Keep AI-generated work and human follow-ups moving.
```

Primary action:

```text
Create task
```

Tabs:

```text
All
My Tasks
Running
Completed
Failed
Needs Approval
```

Task examples:

```text
Review Nova's quotation
Needs approval

Follow up with Meridian Labs
In progress

Review new lead from website
Pending

Approve customer email
Needs approval

Update HubSpot contact
Completed
```

Include:

```text
Priority
Assignee
Agent
Due date
Status
Created
```

---

# Screen 05 — Knowledge

Heading:

```text
Knowledge
```

Subtitle:

```text
Give your agents a reliable source of truth.
```

Primary action:

```text
Add source
```

Sections:

```text
Knowledge sources
Documents
Websites
FAQs
Manual knowledge
```

Example sources:

```text
Product Handbook.pdf
Pricing & Plans.pdf
Customer FAQ.docx
help.forma.io
Sales Playbook.pdf
Returns Policy.pdf
```

Show indexing states:

```text
Indexed
Processing
Syncing
Failed
```

Include:

```text
Test your knowledge
```

with example:

```text
"What is included in the Business plan?"
```

---

# Screen 06 — Customers

Heading:

```text
Customers
```

Subtitle:

```text
Manage customers, leads, and AI-generated business context.
```

Primary action:

```text
Add customer
```

Filters:

```text
All
Leads
Qualified
Customers
Inactive
```

Table/list columns:

```text
Customer
Company
Status
Lead score
Source
Assigned agent
Last contact
Next action
```

Example:

```text
Olivia Chen
Meridian Labs
Qualified
92
Website
Nova
Today

Marcus Reed
Vertex Systems
Lead
86
WhatsApp
Nova
Tomorrow

Sofia Patel
Aster Studio
Meeting booked
89
Website
Luna
Oct 8
```

---

# Screen 07 — Conversations

Heading:

```text
Conversations
```

Subtitle:

```text
Every customer conversation, in one place.
```

Primary action:

```text
New conversation
```

Three-column layout:

```text
Inbox
    ↓
Conversation
    ↓
Customer context
```

Channels:

```text
WhatsApp
Web chat
Email
Voice
Instagram
```

Show:

```text
Agent
Sentiment
Intent
Lead score
Tags
Human takeover
```

---

# Screen 08 — Integrations

Heading:

```text
Integrations
```

Subtitle:

```text
Connect your agents to the tools your business already uses.
```

Primary action:

```text
Browse integrations
```

Categories:

```text
Communication
CRM
Calendar
Payments
E-commerce
Automation
Developer tools
```

Cards:

```text
Gmail
Connected

Google Calendar
Connected

Slack
Connected

HubSpot
Connected

Shopify
Connected

WooCommerce
Connect

Stripe
Connected

WhatsApp
Connected

REST API
Connect

Webhooks
Connected
```

Integration status should visually distinguish:

```text
Connected
Reconnect
Connect
Error
```

---

# Screen 09 — Analytics

Heading:

```text
Analytics
```

Subtitle:

```text
Understand impact, efficiency, and customer experience.
```

Primary action:

```text
Export report
```

Metrics:

```text
38,420 conversations
94.8% resolution rate
4.8/5 CSAT
$0.024 cost / conversation
8.2M AI tokens
142h estimated time saved
```

Charts:

```text
Conversation volume
Agent performance
Automation success
AI cost
Lead conversion
Customer satisfaction
```

Include filters:

```text
7 days
30 days
90 days
Custom
```

---

# Screen 10 — Activity / Logs

Heading:

```text
Activity
```

Subtitle:

```text
See what your agents, automations, and team members are doing.
```

Activity feed:

```text
Nova qualified a new lead
2 minutes ago

Atlas resolved ticket #2048
5 minutes ago

Luna booked a product demo
8 minutes ago

Jordan updated Nova's instructions
14 minutes ago

Automation "Lead Qualification" completed
21 minutes ago
```

Filters:

```text
All activity
Agents
Automations
Team
Integrations
Security
```

Each event should identify:

```text
Actor
Action
Resource
Timestamp
Status
```

---

# Screen 11 — Templates

Heading:

```text
Templates
```

Subtitle:

```text
Start with proven AI agents and automation workflows.
```

Primary action:

```text
Create from template
```

Template categories:

```text
Sales
Support
Lead Generation
Scheduling
E-commerce
Operations
Recruitment
```

Templates:

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

Each card should show:

```text
Template name
Description
Category
Recommended tools
Estimated setup time
Use template
```

---

# Screen 12 — Team & Roles

Heading:

```text
Team & Roles
```

Subtitle:

```text
Manage your team and control what each member can access.
```

Primary action:

```text
Invite member
```

Members:

```text
Alex Morgan
Owner

Jordan Lee
Admin

Casey Williams
Manager

Sam Rivera
Viewer

Taylor Brooks
Viewer
Pending
```

Permission matrix:

```text
Owner
Full access

Admin
Workspace management

Manager
Agents, workflows, customers

Member
Daily operations

Viewer
Read-only access
```

---

# Screen 13 — Billing

Heading:

```text
Billing & Usage
```

Subtitle:

```text
Manage your subscription and monitor platform consumption.
```

Primary action:

```text
Upgrade plan
```

Current plan:

```text
Business
$149 / month
```

Usage:

```text
Agents
12 / 20

Messages
38,420 / 50,000

AI tokens
8.2M / 12M

Team members
7 / 10

Knowledge storage
18 GB / 25 GB
```

Invoices:

```text
October 2026
$149
Paid

September 2026
$149
Paid

August 2026
$149
Paid
```

Include:

```text
Manage subscription
Payment method
Billing history
Usage limits
```

---

# Screen 14 — Settings

Heading:

```text
Settings
```

Subtitle:

```text
Manage your workspace, access, integrations, and security.
```

Settings navigation:

```text
General
Workspace
Members & Roles
AI Settings
Security
Notifications
API Keys
Webhooks
Audit Logs
```

General settings:

```text
Workspace name
Forma Studio

Workspace URL
orbit.ai/forma

Timezone
America/New_York

Currency
USD
```

Security:

```text
Two-factor authentication
Enabled

Session timeout
24 hours
```

API:

```text
Production API Key
••••••••••••••••••••

Copy
Regenerate
```

Webhook:

```text
https://api.forma.io/events
```

Events:

```text
conversation.created
lead.qualified
workflow.completed
approval.requested
```

---

# 15. UPDATED SIDEBAR FINAL STRUCTURE

The final sidebar must visually communicate the platform hierarchy:

```text
orbit / AI

FORMA STUDIO
Pro workspace

WORKSPACE

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

MANAGEMENT

Team & Roles
Billing
Settings
```

Footer:

```text
● All systems operational

Alex Morgan
Workspace owner
```

---

# 16. IMPORTANT TERMINOLOGY CHANGES

Replace old terminology throughout the existing design.

```text
Overview
→ Dashboard

Agents
→ AI Agents

Workflows
→ Automations

Knowledge Base
→ Knowledge

Leads & CRM
→ Customers

Billing & Usage
→ Billing

Activity
→ Activity / Logs
```

Do not use both old and new names interchangeably.

Use the new terminology consistently across:

* Sidebar
* Breadcrumbs
* Page headings
* Buttons
* Cards
* Empty states
* Filters
* Mock data
* Tooltips
* Navigation

---

# 17. PRODUCT HIERARCHY

The visual hierarchy should now communicate:

```text
Dashboard
    │
    ├── AI Agents
    │      └── Agent runs / tools / knowledge
    │
    ├── Automations
    │      └── Workflow executions
    │
    ├── Tasks
    │      └── Human approvals
    │
    ├── Knowledge
    │      └── Documents / RAG
    │
    ├── Customers
    │      └── Customer context
    │
    ├── Conversations
    │      └── AI + human communication
    │
    ├── Integrations
    │      └── External tools
    │
    ├── Analytics
    │
    ├── Activity / Logs
    │
    └── Templates
```

This should feel like an **AI workforce operating system**, rather than a traditional CRM.

---

# 18. IMPORTANT DESIGN RULE

Do not make the interface feel like:

```text
CRM + chatbot
```

Instead make it feel like:

```text
AI Workforce Control Center
```

The user should immediately understand:

```text
What are my agents doing?
What work did they complete?
What needs my approval?
What automations are running?
What customers are being handled?
How much business value is being generated?
```

Those should be the dominant concepts in the dashboard.

---

# 19. ADMIN PANEL VS CUSTOMER WORKSPACE

Keep the current design prepared for a future distinction between:

```text
Platform Admin
```

and

```text
Business Workspace
```

The current screens should represent the **Business Workspace / Admin Dashboard**, where a customer manages their own AI workforce.

A future platform-level super-admin panel can have a separate navigation such as:

```text
Platform Overview
Organizations
Users
Subscriptions
Plans
AI Usage
System Health
Integrations
Templates
Support
Audit Logs
Platform Settings
```

Do NOT mix those platform-admin items into the current workspace navigation.

The current product is the **workspace admin panel**.
