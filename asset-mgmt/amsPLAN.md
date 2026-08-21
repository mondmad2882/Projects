Optimized tool selection## SECTION 1 — INDUSTRY ANALYSIS

### How Real-World Asset Management Systems Work

- Enterprise asset management systems are designed to track the full lifecycle of company-owned physical and digital assets.
- They act as a single source of truth for procurement, inventory, allocation, maintenance, depreciation, compliance, and disposal.
- These systems integrate with HR, ITSM, finance, and procurement, allowing asset requests, approvals, warranty tracking, and audit reporting.

### Common Workflows in Companies

- Asset procurement → asset onboarding → asset categorization → asset assignment → periodic inventory reconciliation → incident/repair reporting → asset disposal/retirement.
- Employees request assets through a portal or via manager/IT approval.
- IT or asset managers assign assets and track condition, location, and custodian.
- At exit or role change, assets are returned, audited, or replaced.

### Standard Enterprise Features

- Centralized inventory dashboard
- Role-based authorization
- Approval workflows
- Asset lifecycle status transitions
- Audit trail / activity logs
- Integration points for barcode/QR scanning
- Reporting: department, location, employee, condition, utilization
- Notifications: assignment, return reminders, maintenance alerts
- Soft delete and data archival
- Multi-tenancy or multi-branch support for large enterprises

### Common User Roles

- Super Admin
- Admin
- Asset Manager
- HR Manager
- Department Manager
- Employee/User
- IT Support
- Auditor

### Common Approval Systems

- Request → Manager approval → IT/Asset approval → assignment.
- Return requests often require supervisor or IT confirmation.
- Damaged/repair status may require IT inspection and manager signoff.
- Purchase/replacement approvals can be routed through finance or procurement.

### Lifecycle of an Asset

- New/Procured
- Available/Ready
- Assigned
- In Use
- Under Repair
- Damaged
- Retired/Disposed
- Lost/Missing

### Challenges in Asset Tracking

- Data inconsistency across spreadsheets and systems
- Lost or stolen assets
- Poor asset condition tracking
- No ownership visibility
- Manual assignment delays
- Incomplete audit trail
- Scalability problems when volume increases
- Incorrect depreciation or warranty data

### Best Practices in Industry

- Enforce unique asset identification
- Track both physical condition and assignment history
- Use role-based access control
- Maintain audit logs for all state changes
- Keep minimal authoritative relationships (employee ↔ assignment, asset ↔ category)
- Use soft delete so historical data remains intact
- Apply pagination and filtering for large asset sets

### Security Considerations

- Use JWT with short-lived access tokens and refresh tokens
- Hash passwords with bcrypt/argon2
- Protect routes by role and ownership
- Sanitize all input to prevent injection
- Use HTTPS, secure cookies, and CORS restrictions
- Log authentication events and failures

### Audit Logging Importance

- Audit logs prove who changed an asset, when, and why.
- Required for compliance in enterprises and for internal investigations.
- Helps detect unauthorized changes or fraudulent asset movement.

### Scalability Concerns

- Asset collections may grow to tens of thousands; use proper indexes.
- Use paginated APIs, not full collection fetches.
- Separate read-heavy dashboard/reporting queries from transactional flows.
- Design database schemas to support sharding or replica sets.
- Consider eventual consistency for analytics dashboards.

### Small Company vs Enterprise Systems

- Small company:
  - Simpler workflows
  - Few roles
  - Spreadsheet-level reporting
  - Less strict compliance
  - Limited user concurrency
- Enterprise:
  - Strong RBAC and approval workflows
  - Multi-department/branch support
  - Audit and compliance requirements
  - High volume of assets/users
  - Integration with HR/payroll/ITSM systems
  - Performance and scaling concerns

---

## SECTION 2 — ROLE ANALYSIS

### Role Definitions

#### Super Admin

- Purpose: Full control over system configuration and all data.
- Responsibilities:
  - Create admins and roles
  - Manage settings and system-wide parameters
  - View all reports and audit logs
- Permissions:
  - Full CRUD on users, roles, assets, employees, assignments, departments, reports
- Allowed screens:
  - Admin management, Settings, Audit Logs, Dashboard, Reports
- CRUD:
  - Full create/read/update/delete
- Restrictions:
  - Minimal; reserved for highest trust
- Dashboard visibility:
  - Full enterprise metrics, system health
- Workflow authority:
  - System-level approvals, configuration changes

#### Admin

- Purpose: Operate the asset system day-to-day.
- Responsibilities:
  - Manage assets and employees
  - Approve assignments and returns
  - Run reports
- Permissions:
  - CRUD on assets, employees, departments, assignments
  - Read reports and audit logs
- Screens:
  - Assets, Employees, Assignments, Reports, Dashboard
- CRUD:
  - Full on operational data
- Restrictions:
  - Cannot manage roles or system settings
- Dashboard:
  - Asset inventory and assignment metrics
- Workflow authority:
  - Approve asset assignment, manage lifecycle changes

#### Asset Manager

- Purpose: Focus on asset inventory and lifecycle.
- Responsibilities:
  - Add/edit asset records
  - Track condition and repair history
  - Manage categories/status
- Permissions:
  - CRUD on assets, categories, repair history
  - Read assignments and employee assignments
- Screens:
  - Asset Management, Inventory, Repair History
- CRUD:
  - Full on assets and asset metadata
- Restrictions:
  - Not full HR or user management
- Dashboard:
  - Asset availability, damaged assets, repair queue
- Workflow:
  - Asset assignment support, repair and retirement workflows

#### HR Manager

- Purpose: Manage employee data and department assignments.
- Responsibilities:
  - Onboard/offboard employees
  - Manage department and designation structures
- Permissions:
  - CRUD on employees, departments, designations
  - Read assignments related to employees
- Screens:
  - Employee Management, Departments, Reports
- CRUD:
  - Full on employee data
- Restrictions:
  - No asset deletion or role management
- Dashboard:
  - Headcount, department asset counts
- Workflow:
  - Employee onboarding, offboarding approvals

#### Department Manager

- Purpose: Oversee asset usage within a department.
- Responsibilities:
  - Approve assignment requests for team members
  - Review department asset utilization
- Permissions:
  - Read assets and employees in own department
  - Approve assignment requests
  - View reports for own department
- Screens:
  - Department Dashboard, Assignment Requests, Employees
- CRUD:
  - Limited; mostly approve/deny workflows
- Restrictions:
  - Cannot delete assets or manage employees outside department
- Dashboard:
  - Department asset summary, pending approvals
- Workflow:
  - Approval authority for department-level assignments

#### Employee/User

- Purpose: Request and receive assets.
- Responsibilities:
  - View assigned assets and request new equipment
  - Report damaged items
- Permissions:
  - Read own profile and assignments
  - Create asset requests
- Screens:
  - My Assets, Requests, Profile
- CRUD:
  - Create requests, read own data
- Restrictions:
  - Cannot modify assets or employee data
- Dashboard:
  - Personal assigned assets, return due alerts
- Workflow:
  - Asset request submission, return initiation

#### IT Support

- Purpose: Handle repairs and damage reports.
- Responsibilities:
  - Process repair tickets
  - Update asset status to Repair/Damaged
  - Approve returns after inspection
- Permissions:
  - Read asset and assignment details
  - Update repair history and statuses
- Screens:
  - Repair Queue, Asset Details, Assignment History
- CRUD:
  - Update on repair records, read access
- Restrictions:
  - Cannot delete assets or users
- Dashboard:
  - Repair queue, damaged assets
- Workflow:
  - Asset condition verification, repair completion

#### Auditor (optional)

- Purpose: Review logs and compliance data.
- Responsibilities:
  - Inspect audit records, asset changes, assignment history
- Permissions:
  - Read-only on audit logs, assignments, assets, reports
- Screens:
  - Audit Logs, Reports, Asset History
- CRUD:
  - Read-only
- Restrictions:
  - No modifications
- Dashboard:
  - Compliance metrics, change history
- Workflow:
  - Audit review and reporting

### Role Feature Matrix (high-level)

| Role               | Asset CRUD    | Employee CRUD | Assignment CRUD | Reports | Audit Logs | Settings | Approval |
| ------------------ | ------------- | ------------- | --------------- | ------- | ---------- | -------- | -------- |
| Super Admin        | Yes           | Yes           | Yes             | Yes     | Yes        | Yes      | Yes      |
| Admin              | Yes           | Yes           | Yes             | Yes     | Read       | No       | Yes      |
| Asset Manager      | Yes           | No            | Read/Update     | Yes     | Read       | No       | No       |
| HR Manager         | No            | Yes           | Read            | Yes     | Read       | No       | No       |
| Department Manager | Read          | Read          | Approve         | Limited | No         | No       | Yes      |
| Employee           | Read own      | Read own      | Request         | None    | No         | No       | No       |
| IT Support         | Update repair | Read          | Read/Update     | Limited | No         | No       | No       |
| Auditor            | Read-only     | Read-only     | Read-only       | Yes     | Yes        | No       | No       |

### RBAC vs Permission-Based Systems

- RBAC groups permissions by role. Easier for enterprise because roles map to job responsibilities.
- Permission-based systems assign granular rights to individuals. More flexible but harder to manage at scale.
- Recommended: RBAC for most system logic, with optional permission flags for exceptional cases.

### JWT Strategy

- Use access token for route protection.
- Use refresh token for session renewal.
- Store access token in memory or secure storage, refresh token in HttpOnly cookie.
- Include role claims in JWT payload.
- Validate issuer, audience, expiration.
- Use short-lived tokens (15-30 mins) and refresh tokens for long sessions.

---

## SECTION 3 — FEATURE BREAKDOWN

### 1. Authentication

- Purpose: Secure access and identify users with roles.
- User Stories:
  - As a user, I can log in with email/password.
  - As an admin, I can manage login sessions.
- Functional:
  - Login, logout, refresh token, password hashing, role-based route guard, forgot password
- Non-functional:
  - 99.9% availability, secure password storage, fast authentication latency
- Edge cases:
  - Invalid credentials
  - Locked/disabled accounts
  - Expired tokens
- Validation:
  - Email format, password strength, required fields
- Business rules:
  - Only active users can login
  - Rate limit login attempts
- Future:
  - SSO/OAuth, MFA, biometric login

### 2. Dashboard

- Purpose: Provide fast enterprise insights.
- User Stories:
  - As a manager, I view asset counts and trends.
- Functional:
  - Summary widgets, recent assignments, status breakdown, approval tasks
- Non-functional:
  - Load within 1s, cache summary data
- Edge cases:
  - Empty datasets, large datasets
- Validation:
  - Date filters valid
- Business rules:
  - Only show data permitted by role
- Future:
  - Real-time websocket updates, custom dashboards

### 3. Asset Management

- Purpose: Manage asset records and lifecycle.
- User Stories:
  - As an asset manager, I add and update assets.
  - As an employee, I search for available equipment.
- Functional:
  - Create/edit/delete assets, search, filter, sort, paginate, status categories
- Non-functional:
  - Efficient list queries with thousands of records
- Edge cases:
  - Duplicate serial numbers
  - Assigning damaged assets
- Validation:
  - Required name, category, serial number uniqueness
- Business rules:
  - Cannot delete assigned asset
  - Asset status must follow enumeration
- Future:
  - QR/barcode scanning, bulk import/export, depreciation tracking

### 4. Employee Management

- Purpose: Track employees and their asset assignments.
- User Stories:
  - As HR, I onboard a new team member.
- Functional:
  - CRUD employees, assign department/designation, view asset history
- Non-functional:
  - Searchable employee directory
- Edge cases:
  - Offboarded employees with active assets
  - Duplicate employee IDs
- Validation:
  - Required email, department, active status
- Business rules:
  - Cannot delete employee with assigned assets
  - Employee records persist for audit
- Future:
  - Sync with HR systems, employee self-service portal

### 5. Asset Assignment

- Purpose: Allocate assets to employees consistently.
- User Stories:
  - As an admin, I assign a laptop to an employee.
- Functional:
  - Create assignment, return asset, view history, due dates, approval workflow
- Non-functional:
  - Atomic operations to prevent double assignment
- Edge cases:
  - Asset already assigned
  - Return date before assign date
- Validation:
  - Asset available, employee active
- Business rules:
  - Assigned asset status becomes Assigned
  - Return triggers status Available if in good condition
- Future:
  - Assignment request workflows, auto-reminders

### 6. Reports

- Purpose: Deliver operational and compliance data.
- User Stories:
  - As a manager, I export asset utilization.
- Functional:
  - Filtered reports, export to Excel/PDF, departmental summaries
- Non-functional:
  - Support large exports, secure report access
- Edge cases:
  - No data for selected period
- Validation:
  - Date ranges valid
- Business rules:
  - Only authorized roles can access sensitive reports
- Future:
  - Scheduled exports, BI integration

### 7. Notifications

- Purpose: Keep stakeholders informed.
- User Stories:
  - As an employee, I receive return reminders.
- Functional:
  - Alerts for assignments, overdue returns, repairs
- Non-functional:
  - Reliable delivery, minimal false alerts
- Edge cases:
  - Duplicate notifications
- Validation:
  - Valid recipient
- Business rules:
  - Only send notifications for relevant events
- Future:
  - Email/SMS, Slack integrations

### 8. Audit Logs

- Purpose: Track changes for compliance.
- User Stories:
  - As an auditor, I can inspect modification history.
- Functional:
  - Record create/update/delete events, who and when
- Non-functional:
  - Immutable log entries, searchable
- Edge cases:
  - Missing actor data if system process changes data
- Validation:
  - Log required fields
- Business rules:
  - Never delete audit logs; soft delete only
- Future:
  - Retention policies, log archival

### 9. Search & Filters

- Purpose: Help users find assets or employees quickly.
- User Stories:
  - As a user, I search assets by serial number.
- Functional:
  - Search text, filters by status, category, department
- Non-functional:
  - Fast response for large collections
- Edge cases:
  - Special characters in queries
- Validation:
  - Search string length limits
- Business rules:
  - Combine filters with AND semantics
- Future:
  - Full-text search, fuzzy matching

### 10. Settings

- Purpose: Configure system defaults and metadata.
- User Stories:
  - As an admin, I manage asset categories.
- Functional:
  - Manage categories, statuses, role definitions, system preferences
- Non-functional:
  - Secure access
- Edge cases:
  - Category deletion when in use
- Validation:
  - Unique category names
- Business rules:
  - Prevent deleting categories with dependent assets
- Future:
  - Multi-language support, custom fields

---

## SECTION 4 — DATABASE DESIGN

### Why MongoDB Fits

- Flexible schema supports evolving asset metadata.
- Document model works well for nested asset history records.
- Good for fast iteration in MERN.
- Supports horizontal scaling via sharding.
- Works naturally with JSON-like data consumed by Node/React.

### Embedding vs Referencing

- Embed when data is tightly coupled and read together (e.g., assignment history in asset document if history volume is small).
- Reference when relationships are many-to-many or data size grows large (e.g. users, assets, assignments).
- Recommended mix:
  - Reference assets to categories, employees to departments.
  - Keep assignment history as separate collection for querying and audit.

### Collections

#### Users

- `_id`: ObjectId
- `name`: string, required
- `email`: string, required, unique, indexed
- `passwordHash`: string, required
- `role`: ObjectId ref `Roles`, required
- `status`: string enum [`active`, `inactive`, `suspended`], default `active`
- `lastLoginAt`: Date
- `createdAt`: Date
- `updatedAt`: Date
- `deletedAt`: Date|null
- `isDeleted`: boolean default false
- `profile`: object with phone, location

Explanation:

- Base auth entity. Role reference enables RBAC. Soft delete keeps history.

Sample:
{
\_id,
name: "Jane Doe",
email: "jane@example.com",
passwordHash: "...",
role: ObjectId("..."),
status: "active",
lastLoginAt: ISODate("2026-05-28T08:00:00Z"),
createdAt: ISODate(...),
updatedAt: ISODate(...),
isDeleted: false
}

#### Roles

- `_id`: ObjectId
- `name`: string unique [`SuperAdmin`,`Admin`,`AssetManager`,`HRManager`,`DepartmentManager`,`Employee`,`ITSupport`,`Auditor`]
- `permissions`: array of strings
- `description`: string
- `createdAt`, `updatedAt`

Explanation:

- Role metadata and permission list for RBAC.

Sample:
{
\_id,
name: "AssetManager",
permissions: ["asset:create","asset:update","asset:view","repair:view"],
description: "Manages asset catalog and lifecycle",
}

#### Assets

- `_id`: ObjectId
- `assetTag`: string unique, required
- `serialNumber`: string optional, indexed
- `name`: string required
- `categoryId`: ObjectId ref `AssetCategories`, required
- `status`: string enum [`Available`,`Assigned`,`Damaged`,`Repair`,`Retired`], default `Available`
- `condition`: string enum [`New`,`Good`,`Fair`,`Poor`], default `Good`
- `location`: string
- `purchaseDate`: Date
- `warrantyExpiry`: Date
- `supplier`: string
- `customFields`: object
- `currentAssignmentId`: ObjectId ref `Assignments` optional
- `historyCount`: number default 0
- `createdBy`: ObjectId ref `Users`
- `createdAt`, `updatedAt`
- `isDeleted`: boolean default false
- `deletedAt`: Date|null

Explanation:

- Canonical asset record. `assetTag` is unique business identifier.
- `currentAssignmentId` makes fast status checks.

Sample:
{
\_id,
assetTag: "ASSET-2026-0012",
serialNumber: "SN-987654",
name: "Dell Latitude 7440",
categoryId: ObjectId("..."),
status: "Available",
condition: "Good",
location: "HQ IT Store",
purchaseDate: ISODate("2024-09-10"),
warrantyExpiry: ISODate("2026-09-09"),
currentAssignmentId: null,
createdAt: ...,
isDeleted: false
}

#### AssetCategories

- `_id`: ObjectId
- `name`: string unique
- `description`: string
- `createdAt`, `updatedAt`
- `isDeleted`: boolean default false

Sample:
{ \_id, name:"Laptop", description:"Portable computing devices" }

#### Employees

- `_id`: ObjectId
- `employeeId`: string unique, required
- `firstName`, `lastName`: string required
- `email`: string unique, required
- `departmentId`: ObjectId ref `Departments`, required
- `designation`: string required
- `managerId`: ObjectId ref `Employees` optional
- `joinDate`: Date
- `exitDate`: Date|null
- `status`: [`Active`,`Inactive`,`OnLeave`]
- `profile`: object phone, location
- `createdAt`, `updatedAt`
- `isDeleted`: boolean default false

Explanation:

- Tracks internal users separate from login users. Employee records can exist even after offboarding.

Sample:
{
\_id,
employeeId: "EMP-101",
firstName: "Arjun",
lastName: "Patel",
email: "arjun.patel@company.com",
departmentId: ObjectId("..."),
designation: "Software Engineer",
status: "Active",
joinDate: ISODate("2024-01-15"),
isDeleted: false
}

#### Assignments

- `_id`: ObjectId
- `assetId`: ObjectId ref `Assets`, required
- `employeeId`: ObjectId ref `Employees`, required
- `assignedBy`: ObjectId ref `Users`, required
- `assignedAt`: Date default now
- `dueDate`: Date optional
- `returnDate`: Date|null
- `status`: enum [`Assigned`,`Returned`,`Overdue`,`Cancelled`]
- `conditionOnReturn`: string enum [`New`,`Good`,`Fair`,`Poor`,`Damaged`] optional
- `remarks`: string
- `approval`: object { status: `Pending`|`Approved`|`Rejected`, approverId, approvedAt, comments }
- `createdAt`, `updatedAt`
- `isDeleted`: boolean default false

Explanation:

- Assignment is a transaction record. Retains history and approval state.

Sample:
{
\_id,
assetId:ObjectId("..."),
employeeId:ObjectId("..."),
assignedBy:ObjectId("..."),
assignedAt: ISODate(...),
dueDate: ISODate("2026-08-01"),
status: "Assigned",
approval:{status:"Approved",approverId:ObjectId("..."),approvedAt:ISODate(...)}
}

#### Departments

- `_id`: ObjectId
- `name`: string unique required
- `managerId`: ObjectId ref `Employees`
- `description`: string
- `createdAt`, `updatedAt`
- `isDeleted`: boolean default false

Sample:
{ \_id, name:"Engineering", managerId:ObjectId("..."), description:"Product engineering team" }

#### AuditLogs

- `_id`: ObjectId
- `entityType`: string [`Asset`,`Employee`,`Assignment`,`User`,`Department`]
- `entityId`: ObjectId
- `action`: string [`Create`,`Update`,`Delete`,`Assign`,`Return`,`StatusChange`]
- `performedBy`: ObjectId ref `Users`
- `performedAt`: Date
- `changes`: object
- `remarks`: string
- `ipAddress`: string
- `userAgent`: string

Explanation:

- Chronological audit trail.

Sample:
{
entityType:"Asset",
entityId:ObjectId("..."),
action:"Update",
performedBy:ObjectId("..."),
performedAt:ISODate(...),
changes:{status:{from:"Available",to:"Assigned"}}
}

#### Notifications

- `_id`: ObjectId
- `recipientId`: ObjectId ref `Users`
- `type`: string [`Assignment`,`ReturnReminder`,`Repair`,`Approval`,`System`]
- `title`: string
- `message`: string
- `isRead`: boolean default false
- `data`: object
- `createdAt`, `updatedAt`
- `readAt`: Date|null
- `isDeleted`: boolean default false

Explanation:

- Used for in-app notifications and can trigger email/SMS.

Sample:
{ recipientId:ObjectId("..."), type:"Assignment", title:"New Asset Assigned", message:"Laptop assigned to you", isRead:false }

#### RepairHistory

- `_id`: ObjectId
- `assetId`: ObjectId ref `Assets`
- `reportedBy`: ObjectId ref `Users`
- `reportedAt`: Date
- `issueDescription`: string
- `status`: [`Reported`,`InProgress`,`Resolved`,`CannotRepair`]
- `resolvedAt`: Date|null
- `resolutionNotes`: string
- `cost`: number
- `repairVendor`: string
- `createdAt`, `updatedAt`

Explanation:

- Logs repair events distinct from assignment history.

Sample:
{
assetId:ObjectId("..."),
reportedBy:ObjectId("..."),
reportedAt:ISODate(...),
issueDescription:"Screen flickering",
status:"Resolved",
resolvedAt:ISODate(...),
cost:120
}

#### ActivityLogs

- `_id`: ObjectId
- `userId`: ObjectId ref `Users`
- `action`: string
- `resource`: string
- `metadata`: object
- `timestamp`: Date

Explanation:

- General user activity tracking for UI/UX and security.

Sample:
{ userId:ObjectId("..."), action:"Login", resource:"Auth", metadata:{ip:"..."}, timestamp:ISODate(...) }

### Indexing Suggestions

- `Users.email` unique index
- `Assets.assetTag` unique index
- `Assets.serialNumber` index
- `Assets.status` + `categoryId` compound index
- `Assignments.assetId`, `Assignments.employeeId`, `Assignments.status`
- `Employees.employeeId` unique index
- `Departments.name` unique index
- `AuditLogs.entityType`, `entityId`, `performedAt`
- `Notifications.recipientId`, `isRead`
- `RepairHistory.assetId`, `status`

### Soft Delete Strategy

- Use `isDeleted` boolean and `deletedAt` date.
- Keep soft-deleted documents for audit and restore.
- Exclude soft deleted records in default queries via middleware or repository filter.

---

## SECTION 5 — API DESIGN

### API Naming Conventions

- Use nouns, not verbs
- Use plural resource names
- Use version prefix `/api/v1`
- Use query params for filtering/sorting/pagination
- Use proper HTTP methods

### Versioning Strategy

- Start with `/api/v1`
- Support minor versioning in headers for future compatibility
- Use `v2` only for breaking API changes

### Error Response Structure

Standard response:
{
success: false,
error: "Invalid credentials",
code: "AUTH_INVALID_CREDENTIALS",
details: {...}
}

### Pagination Strategy

- Query params: `page`, `limit`
- Respond with `meta`: `{ page, limit, total, pages }`
- Avoid offset-only with `skip` for large datasets; use cursor-based later for high scale

### Filtering Strategy

- Use query params: `status`, `category`, `department`, `search`, `fromDate`, `toDate`
- Normalize filters into a query object on backend
- Support combined AND filtering

---

### Auth APIs

#### POST /api/v1/auth/login

- Purpose: Authenticate user
- Body: `{ email, password }`
- Response: `{ accessToken, refreshToken, user:{id,name,email,role} }`
- Validation: required email/password, valid email format
- Auth: none
- Errors: 401 invalid credentials, 403 account inactive, 400 validation

#### POST /api/v1/auth/refresh

- Purpose: Refresh access token
- Body: `{ refreshToken }` or HttpOnly cookie
- Response: `{ accessToken }`
- Auth: none
- Errors: 401 invalid/expired refresh token

#### POST /api/v1/auth/logout

- Purpose: End session
- Body: none or `{ refreshToken }`
- Response: `{ success:true }`
- Auth: yes
- Errors: 401 unauthorized

#### POST /api/v1/auth/forgot-password

- Purpose: Request reset
- Body: `{ email }`
- Response: `{ success:true }`
- Auth: none
- Errors: 404 email not found

#### POST /api/v1/auth/reset-password

- Purpose: Reset password
- Body: `{ token, newPassword }`
- Response: `{ success:true }`
- Auth: none
- Errors: 400 invalid token

---

### Asset APIs

#### GET /api/v1/assets

- Purpose: list assets
- Query: `page, limit, search, status, category, location, sortBy, sortOrder`
- Response: `{ data:[assets], meta:{page,limit,total,pages} }`
- Auth: yes
- Permissions: `asset:view`
- Errors: 403 unauthorized

#### POST /api/v1/assets

- Purpose: create asset
- Body: `{ assetTag, serialNumber, name, categoryId, status, location, purchaseDate, warrantyExpiry, condition }`
- Auth: yes
- Permissions: `asset:create`
- Response: created asset
- Errors: 400 validation, 409 duplicate assetTag

#### GET /api/v1/assets/:id

- Purpose: get details
- Auth: yes
- Permissions: `asset:view`

#### PUT /api/v1/assets/:id

- Purpose: update asset
- Body: modifiable fields
- Auth: yes
- Permissions: `asset:update`
- Errors: 400 invalid status transitions, 409 duplicate serial number

#### DELETE /api/v1/assets/:id

- Purpose: soft delete asset
- Auth: yes
- Permissions: `asset:delete`
- Business: reject if asset assigned or under repair
- Response: success
- Errors: 403 restricted, 409 cannot delete

#### GET /api/v1/assets/:id/history

- Purpose: asset assignment and repair history
- Auth: yes
- Permissions: `asset:view`

#### GET /api/v1/asset-categories

- Purpose: list categories
- Auth: yes
- Permissions: `asset:view`

#### POST /api/v1/asset-categories

- Purpose: create category
- Auth: yes
- Permissions: `asset:create`

---

### Employee APIs

#### GET /api/v1/employees

- Purpose: list employees
- Query: `page, limit, department, status, search`
- Auth: yes
- Permissions: `employee:view`

#### POST /api/v1/employees

- Purpose: create employee
- Auth: yes
- Permissions: `employee:create`
- Validation: unique email, employeeId

#### GET /api/v1/employees/:id

- Auth: yes
- Permissions: `employee:view`

#### PUT /api/v1/employees/:id

- Auth: yes
- Permissions: `employee:update`
- Business: cannot set status inactive if active assignments exist

#### DELETE /api/v1/employees/:id

- Auth: yes
- Permissions: `employee:delete`
- Business: reject if active assigned assets

#### GET /api/v1/employees/:id/assets

- Purpose: list assets assigned to employee

---

### Assignment APIs

#### GET /api/v1/assignments

- Purpose: assignment list
- Query: `status, employeeId, assetId, startDate, endDate`
- Auth: yes
- Permissions: `assignment:view`

#### POST /api/v1/assignments

- Purpose: assign asset
- Body: `{ assetId, employeeId, dueDate, approvalRequired, remarks }`
- Auth: yes
- Permissions: `assignment:create`
- Validation: asset status Available, employee active
- Business: create assignment record, update asset status to Assigned

#### PUT /api/v1/assignments/:id/return

- Purpose: return asset
- Body: `{ returnDate, conditionOnReturn, remarks }`
- Auth: yes
- Permissions: `assignment:update`
- Validation: returnDate >= assignedAt
- Business: update asset status based on condition

#### PUT /api/v1/assignments/:id/approve

- Purpose: approve assignment
- Body: `{ approverId, comments }`
- Permissions: `assignment:approve`

#### PUT /api/v1/assignments/:id/cancel

- Purpose: cancel pending assignment

---

### Dashboard APIs

#### GET /api/v1/dashboard/summary

- Purpose: metrics overview
- Auth: yes
- Permissions: `dashboard:view`
- Response: totals, status counts, recent assignments

#### GET /api/v1/dashboard/recent-assignments

- Purpose: recent activity
- Auth: yes
- Permissions: `dashboard:view`

#### GET /api/v1/dashboard/department-summary

- Purpose: breakdown by department

---

### Report APIs

#### GET /api/v1/reports/assets

- Purpose: filtered asset reports
- Query: `status, category, department, location, purchaseDateFrom, purchaseDateTo`
- Auth: yes
- Permissions: `report:view`

#### GET /api/v1/reports/employees`

- Purpose: employee asset reports
- Query: `department, designation, status`

#### GET /api/v1/reports/assignments`

- Purpose: assignment history
- Query: `status, employeeId, assetId, dateRange`

#### GET /api/v1/reports/export

- Purpose: export data
- Query: same filters
- Response: file URL or stream

---

### Notification APIs

#### GET /api/v1/notifications

- Purpose: fetch user notifications
- Auth: yes
- Permissions: `notification:view`

#### PUT /api/v1/notifications/:id/read

- Purpose: mark read

#### POST /api/v1/notifications/test

- Purpose: internal notification prototype

---

## SECTION 6 — FRONTEND ARCHITECTURE

### Suggested Folder Structure

- `src/`
  - `api/`
    - `auth.js`
    - `assets.js`
    - `employees.js`
    - `assignments.js`
    - `reports.js`
    - `notifications.js`
  - `components/`
    - `Button/`
    - `Card/`
    - `DataTable/`
    - `Form/`
    - `Modal/`
    - `Sidebar/`
    - `Widgets/`
  - `contexts/`
    - `AuthContext.js`
    - `NotificationContext.js`
    - `UIContext.js`
  - `hooks/`
    - `useAuth.js`
    - `useFetch.js`
    - `usePagination.js`
  - `pages/`
    - `Auth/`
      - `LoginPage.js`
      - `ForgotPasswordPage.js`
    - `Dashboard/`
      - `DashboardPage.js`
    - `Assets/`
      - `AssetListPage.js`
      - `AssetFormPage.js`
      - `AssetDetailPage.js`
    - `Employees/`
      - `EmployeeListPage.js`
      - `EmployeeFormPage.js`
    - `Assignments/`
      - `AssignmentListPage.js`
      - `AssignAssetPage.js`
    - `Reports/`
      - `ReportPage.js`
    - `Settings/`
      - `SettingsPage.js`
    - `Profile/`
      - `ProfilePage.js`
    - `Audit/`
      - `AuditLogsPage.js`
  - `routes/`
    - `ProtectedRoute.js`
    - `RoleRoute.js`
  - `utils/`
    - `validators.js`
    - `constants.js`
    - `helpers.js`
  - `App.js`
  - `index.js`

### Component Structure

- Smart container pages fetch data and manage state.
- Presentational components handle rendering.
- Example:
  - `AssetListPage` uses `DataTable`, `FilterPanel`, `PaginationControls`.

### Route Protection

- Use React Router with protected routes.
- `ProtectedRoute` enforces authentication.
- `RoleRoute` checks roles or permissions.
- Example:
  - `/admin/assets` accessible only if role has `asset:view`.

### State Management Approach

- Use Context API for auth and theme state.
- Use local component state and hooks for page-level state.
- Use Redux only if app complexity grows beyond medium size.
- Suggested:
  - `AuthContext` for user, tokens, login/logout.
  - `NotificationContext` for toast messages and notification data.

### API Layer Structure

- Centralize API calls in `src/api`.
- Use Axios instance.
- Example:
  - `api/assets.js` exports `getAssets`, `createAsset`, `updateAsset`.

### Axios Setup

- Base URL config
- Request interceptor to attach access token
- Response interceptor to refresh token on 401
- Error normalization
- Example pattern:
  - `axios.defaults.baseURL = process.env.REACT_APP_API_URL`
  - Add `Authorization: Bearer ${token}`

### Context API vs Redux

- Context API:
  - Good for auth, theme, lightweight global state
  - Simpler for MVP
- Redux:
  - Better for large state with many cross-cutting concerns
  - Use only if application state grows significantly
- Recommendation:
  - Start with Context + hooks; migrate to Redux only if needed

### Form Handling Strategy

- Use controlled components and form libraries:
  - `react-hook-form` for performance and validation
  - `yup` or `zod` for schema validation
- Use reusable input components

### Validation Strategy

- Client-side validation for UX
- Server-side validation for security
- Use same rules on backend and frontend where possible
- Examples:
  - required fields
  - valid email
  - due date after assign date
  - unique assetTag check on submit

### Best Practices

- Keep pages thin
- Extract reusable UI components
- Use lazy loading for routes
- Avoid deep prop drilling via context or custom hooks
- Use environment variables for API URLs
- Optimize tables with memoization

### Suggested Pages

- Login
- Dashboard
- Assets
- Asset Detail/Form
- Employees
- Employee Detail/Form
- Assignments
- Reports
- Settings
- Profile
- Audit Logs

---

## SECTION 7 — BACKEND ARCHITECTURE

### Suggested Folder Structure

- `src/`
  - `config/`
    - `db.js`
    - `env.js`
  - `controllers/`
  - `models/`
  - `routes/`
  - `services/`
  - `repositories/`
  - `middlewares/`
  - `utils/`
  - `app.js`
  - `server.js`

### MVC Architecture

- Models: Mongoose schemas
- Controllers: request parsing and response handling
- Services: business logic
- Repositories: DB access encapsulation

### Middleware Structure

- Auth middleware
- RBAC middleware
- Validation middleware
- Error handling middleware
- Logging middleware
- Request rate limiter

### Error Handling

- Central error handler returning structured JSON
- Use custom error classes
- Do not leak internal details
- Log stack traces to file/monitoring

### Logging Strategy

- Use Winston/ Pino
- Separate log files by level
- Log request metadata and errors
- Use correlation IDs if distributed

### Validation Strategy

- Use Joi/Zod/express-validator
- Validate request body, params, query
- Use a middleware to reject invalid requests before business logic

### Authentication Middleware

- Verify JWT
- Attach user to request
- Check token expiration and blacklist if needed

### RBAC Middleware

- Check role or permissions before controller
- Use a permission map
- Example:
  - `authorize('asset:create')`

### Service Layer Suggestion

- Keep controllers thin
- Services perform operations and handle business rules
- Example:
  - `assetService.createAsset(data, user)`
  - `assignmentService.assignAsset(payload, user)`

### Clean Architecture

- Separate concerns so:
  - Controllers handle HTTP
  - Services handle business logic
  - Repositories handle data persistence
- Makes testing easier and code maintainable

### Production Best Practices

- Use environment variables
- Validate config at startup
- Enable CORS only for allowed origins
- Use helmet, compression
- Use clustering if needed
- Monitor performance

---

## SECTION 8 — SECURITY DESIGN

### JWT Authentication

- Use access token and refresh token
- Sign with strong secret
- Store role claim, userId claim
- Access token short-lived
- Validate on each request

### Refresh Tokens

- Use HttpOnly secure cookie for refresh token
- Rotate refresh tokens to prevent reuse
- Invalidate on logout
- Save token fingerprint if needed

### Password Hashing

- Use bcrypt with salt rounds ≥ 10 or argon2
- Never store plain passwords
- Use password reset token flow with expiration

### Role-Based Access

- Authorize by role/permission
- Deny by default
- Avoid embedding role checks in UI only

### Route Protection

- Protect server routes with auth middleware
- Protect frontend routes with React route guards
- Check both frontend and backend

### Rate Limiting

- Protect login/endpoints
- Example: 5 login attempts per 15 minutes
- Use express-rate-limit

### Input Validation

- Validate all incoming data
- Use schema-based validation
- Reject invalid payloads immediately

### MongoDB Injection Prevention

- Avoid using raw query strings
- Validate ids and types
- Use Mongoose query helpers
- Sanitize input

### XSS Prevention

- Escape output in frontend text display
- Use React default escaping
- Sanitize any HTML content if rendered

### CORS

- Restrict allowed origins
- Use credentials only if necessary
- Configure CORS middleware explicitly

### Helmet Usage

- Use `helmet()` for security headers
- Set CSP if serving HTML
- Use `helmet.hidePoweredBy()`

### Secure Environment Variables

- Keep secrets out of source control
- Use `.env` locally, secure vault in production
- Validate required variables at startup

### Common Beginner Mistakes

- Storing JWT in localStorage
- Relying solely on frontend route checks
- Using weak or no password hashing
- Not validating API input
- Allowing broad CORS origins
- Deleting records instead of soft delete

### Production-Grade Practices

- Use HTTPS in production
- Rotate secrets periodically
- Monitor auth failures
- Secure cookies
- Implement security headers and CSP
- Keep dependencies updated

---

## SECTION 9 — BUSINESS RULES

- Assigned assets cannot be reassigned until returned.
- Deleted assets require no active assignment.
- Damaged or under-repair assets cannot be assigned.
- Only admins or asset managers can delete assets.
- AssetTag and serialNumber must be unique.
- Return date must be equal or after assigned date.
- Overdue assignment status updates automatically if due date passed.
- Employee status must be Active to receive new assignments.
- Employee deletion blocked when active assets exist.
- Asset category cannot be deleted if referenced by assets.
- Assignment approval required if request is pending.
- Only active users can authenticate.
- Soft-deleted records are excluded from normal list queries.
- Repair history entries are created when status transitions to Repair/Damaged.
- An asset under repair can only move to Available or Retired after inspection.
- Assignment record retains historical data even after asset return.
- Notifications are only generated for assignment, return reminder, repair, or approval events.
- Audit logs created for asset status changes, assignment actions, employee offboarding, and user role changes.

---

## SECTION 10 — UI/UX DESIGN GUIDELINES

### Dashboard Layout Ideas

- Top row of KPI cards:
  - Total assets, Available, Assigned, Damaged, Repair, Retired, Employees
- Secondary row:
  - Recent assignments table
  - Department asset breakdown chart
  - Repair queue widget

### Sidebar Navigation

- Group by functional areas:
  - Dashboard
  - Assets
  - Employees
  - Assignments
  - Reports
  - Audit Logs
  - Settings
- Include role-specific menus

### Table Design

- Use striped rows and sticky header
- Include selectable columns
- Inline action buttons for edit/view
- Use status badges for quick scanning

### Search/Filter UX

- Place global search above tables
- Use collapsible filter panels
- Provide chip-based active filter summary
- Allow quick filters by status/category

### Modal Usage

- Use modals for inline add/edit forms
- Confirm destructive actions with modal dialogs
- Use small confirmation modals for returns and deletions

### Form UX

- Group fields into sections
- Use clear labels and helper text
- Validate on blur and submit
- Keep forms compact with required field markers

### Status Badge Colors

- Available: green
- Assigned: blue
- Damaged: red
- Repair: orange
- Retired: gray
- Overdue: dark red
- Pending Approval: yellow

### Responsive Design

- Use Bootstrap grid
- Collapse sidebar into hamburger menu on mobile
- Use responsive tables or cards
- Keep critical info visible on smaller screens

### Enterprise UI Patterns

- Dashboard with widgets, tables, and chart cards
- Role-contextual navigation
- Consistent button placement
- Inline search and export actions
- Use modals for workflows, not full page navigation for simple forms

### Accessibility

- Ensure keyboard navigation
- Use aria labels on controls
- Provide high contrast badge colors
- Use semantic HTML
- Support screen readers for forms and status indicators

---

## SECTION 11 — WORKFLOW DIAGRAMS (TEXTUAL)

### 1. Login Workflow

1. User opens login page
2. Submits email/password
3. Backend validates credentials
4. On success, backend returns JWT and refresh token
5. Frontend stores access token and sets user context
6. User navigates to protected dashboard
7. If token expires, refresh flow fetches a new access token

### 2. Asset Creation Workflow

1. Asset manager opens Add Asset form
2. Enters mandatory fields and category
3. System validates required fields and uniqueness
4. Form submits to `/assets`
5. Backend creates asset record and writes audit log
6. UI confirms creation and reloads asset list

### 3. Asset Assignment Workflow

1. Admin chooses asset and employee
2. System verifies asset status is Available and employee is active
3. Optionally submits assignment for approval
4. Backend creates `Assignment` record, updates asset status to Assigned, sets `currentAssignmentId`
5. Notification sent to the employee
6. Dashboard updates assigned counts

### 4. Asset Return Workflow

1. Employee or admin initiates return
2. System validates current assignment and return date
3. Asset condition on return is recorded
4. Backend updates assignment status to Returned, `returnDate`, asset status back to Available or Damaged/Repair
5. Audit log records event
6. Notifications sent to relevant staff

### 5. Damaged Asset Reporting Workflow

1. User reports damage via asset detail page
2. System creates repair history entry
3. Asset status updates to Damaged or Repair
4. IT Support reviews and updates repair status
5. After resolution, asset returns to Available or retires
6. Audit entry created for repair status changes

### 6. Employee Onboarding Workflow

1. HR adds a new employee record
2. Employee gets initial profile data and department assignment
3. System optionally sends welcome notification
4. Admin assigns required assets
5. Assignment logs and employee asset history start immediately

---

## SECTION 12 — ADVANCED FEATURES (OPTIONAL)

### Suggested Advanced Features

- QR code scanning for asset check-in/check-out
- Barcode label support
- Email notifications for assignment and return reminders
- Multi-branch/location support
- Asset depreciation tracking
- Warranty start/expiry tracking
- AI-based analytics for utilization and maintenance prediction
- Predictive maintenance using repair trends
- Mobile app for asset checkout on the floor

### Beginner-Friendly

- QR/barcode support
- Email notifications
- Approval workflows
- Export to Excel/PDF

### Enterprise-Level

- Multi-branch support
- Depreciation and warranty tracking
- AI analytics
- Predictive maintenance
- Integration with ERP/HR/ITSM

---

## SECTION 13 — PROJECT EXECUTION PLAN

### Development Phases

1. Requirements, modeling, and API design
2. Auth + RBAC + base backend structure
3. Asset CRUD + categories + filters
4. Employee CRUD + department setup
5. Assignment workflows + status transitions
6. Dashboard + reports
7. Notifications + audit logs
8. Frontend polish and responsive UI
9. Security hardening and testing
10. Optional advanced features

### Priority Order

1. Authentication
2. Asset Management
3. Employee Management
4. Assignment workflows
5. Dashboard
6. Reports
7. Audit Logs
8. Notifications

### MVP Scope

- Login and role protection
- Asset CRUD and status management
- Employee CRUD
- Assignment create/return
- Basic dashboard
- Simple reports
- Audit logging
- Search/filter/pagination

### Suggested Timeline

- Week 1: Architecture, schema design, auth, backend scaffolding
- Week 2: Asset and employee modules
- Week 3: Assignment workflows and dashboard
- Week 4: Reports, notifications, frontend polish
- Week 5: Security, testing, bug fixes, deployment prep

### Git Commit Strategy

- Small atomic commits
- Use messages like:
  - `feat(auth): add JWT login`
  - `fix(asset): enforce unique assetTag`
  - `refactor(api): extract request validation`
- Keep each commit tied to one feature or fix

### Branching Strategy

- `main` for production-ready code
- `develop` for integrated work
- feature branches:
  - `feature/auth`
  - `feature/assets`
  - `feature/assignments`
- Use pull requests and code reviews

### Agile Sprint Breakdown

- Sprint 1: Core backend + auth + data model
- Sprint 2: Asset and employee management
- Sprint 3: Assignment workflows + dashboard
- Sprint 4: Reports + audit logs + UI improvements
- Sprint 5: Security hardening + final polish

### How to Avoid Beginner Mistakes

- Build APIs before UI
- Keep backend logic out of controllers
- Validate at the edge
- Use soft deletes
- Don’t hardcode secrets
- Test role restrictions early

### How to Impress

- Demonstrate real business workflows
- Explain RBAC and audit log design
- Show data model decisions
- Point out future extensibility like QR codes and analytics

---

## SECTION 14 — INTERVIEW & PRESENTATION PREPARATION

### How to Explain the Project

- Describe it as an internal enterprise asset lifecycle platform.
- Emphasize tracking from procurement to retirement.
- Mention MERN because MongoDB matches flexible asset schema and React delivers responsive dashboards.

### Architectural Decisions

- Use Node/Express for lightweight API and service layer.
- Use MongoDB for its document model and scalability.
- Use JWT for stateless auth and role-based route protection.
- Use separate collections for assignments and audit logs to preserve history.

### Why MERN

- JavaScript across stack speeds development.
- React is ideal for component-driven dashboards.
- Node.js is good for JSON APIs.
- MongoDB fits the asset metadata model naturally.

### Common Interviewer Questions

- Why did you choose RBAC over permission-only model?
- How do you handle asset state transitions safely?
- What are the security risks with JWT and how do you mitigate them?
- How do you scale dashboards and reports?
- How would you add multi-branch support?
- How do you ensure audit trail integrity?

### Important Tradeoffs

- MongoDB offers flexibility but requires careful schema design.
- JWT is efficient but needs refresh token strategy.
- Context API is easier but may need Redux if state grows.
- Soft delete preserves history but requires filtering everywhere.

---

This design is built for a real-world internal asset management platform with enterprise workflows, proper RBAC, auditability, performance considerations, and extensible MERN architecture.
