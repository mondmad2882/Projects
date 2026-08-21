# Asset Management System - Frontend Documentation

This directory contains the React-based frontend application for the Asset Management System. The application is built using modern UI practices, strict client-side validation, role-based access control (RBAC), and interactive asset-tracking widgets.

---

## 🛠️ Technology Stack & Dependencies

The frontend application uses the following libraries and tools to deliver a responsive and secure admin/employee portal:

*   **Core Framework**: **React 19.2.6** (incorporating concurrent features and modern hook architectures).
*   **Routing & Navigation**: **React Router DOM v7.16.0** (managing public/protected boundaries, dynamic layouts, and permission gates).
*   **Styling**: **Tailwind CSS v3.4.4** (with PostCSS and Autoprefixer) for a sleek, responsive dark/light utility system.
*   **Data Processing**: **SheetJS (`xlsx` v0.18.5)** for client-side Excel validation, dynamic table parsing, and template generation.
*   **Quality & Testing**: **Jest** and **React Testing Library** for test execution.

---

## 📁 Source Code Structure & Organization

```
frontend/src/
├── components/          # React components representing pages and layout units
│   ├── Admin/           # Administrative views and dashboard modules
│   │   ├── AdminAssets.js        # Assets CRUD & management
│   │   ├── AdminAssignments.js   # Active asset allocations & returns
│   │   ├── AdminDashboard.js     # System-wide metrics, stats & counters
│   │   ├── AdminEmployees.js     # User management & activation triggers
│   │   ├── AdminReports.js       # Damage incidents & maintenance logs
│   │   ├── AdminRequests.js      # Borrowing request processing & auto-rejections
│   │   ├── AdminRoles.js         # Granular Role-Based Access Control (RBAC) configuration
│   │   └── BulkUploadForm.js     # Spreadsheet import wizard & client-side previewer
│   ├── Employee/        # Employee-facing modules
│   │   ├── EmployeeAssets.js     # Currently assigned assets
│   │   ├── EmployeeHistory.js    # Lifetime borrow log & request statuses
│   │   ├── EmployeeReport.js     # Damage report submission form
│   │   └── EmployeeStatus.js     # Request status tracking & return triggers
│   ├── CanAccess.js     # Declarative inline RBAC component
│   ├── DashboardLayout.js # Main wrapper with sidebar, profile modal, and header
│   ├── ForgotPassword.js # Auth reset forms & link validation
│   ├── LogIn.js          # Authentication portal
│   ├── Pagination.js     # Reusable client/server pagination controller
│   ├── PermissionRoute.js# Permission gate route wrapper
│   ├── ProtectedRoute.js # Authentication requirement wrapper
│   ├── PublicRoute.js    # Guest-only route wrapper
│   ├── SessionManager.js # Active user activity monitor & JWT renewer
│   ├── SortableHeader.js # Reusable table sorting headers
│   └── Tooltip.js        # Lightweight hovered helper cards
├── hooks/               # Custom reusable React hooks
│   ├── usePagination.js # Handles slice & page offset logic
│   └── useTableSort.js  # Manages sorting keys, orders, and comparison handlers
├── App.js               # Application router & base routing structure
├── index.js             # Client root renderer
├── permissions.js       # Helper utilities for roles and granular permission checks
└── config.js            # Global API URL settings
```

---

## 🔑 Key Engineering Concepts

### 1. Role-Based Access Control (RBAC) & Granular Permissions
Rather than locking down views purely by "Admin" or "Employee" roles, this application uses a granular permission model.
*   **Dynamic Helpers (`permissions.js`)**:
    *   `hasPermission(permission)`: Checks if the user's role contains a specific action.
    *   `hasAnyPermission(permissions[])`: Useful for routes/buttons accessible by multiple permission sets.
*   **Gatekeeping (`PermissionRoute.js`)**: Wraps React Router child routes. If the authenticated session lacks the required permissions, the route is intercepted and redirected back to the dashboard.
*   **UI Masking (`CanAccess.js`)**: Enables conditional rendering of buttons/actions directly in components:
    ```jsx
    <CanAccess permission="manage_asset">
      <button onClick={addAsset}>Add Asset</button>
    </CanAccess>
    ```

### 2. Interactive Session Management (`SessionManager.js`)
To safeguard system data, sessions are managed dynamically inside the browser:
*   **Inactivity Detection**: Listens to global events (`mousemove`, `keydown`, `click`, `scroll`). If the user goes idle for more than 30 minutes, they are automatically signed out.
*   **Auto-Refresh JWT Tokens**: Five minutes before the token expires (parsed from JWT payload claims), the app attempts to perform a silent token rotation via a POST request to `/api/auth/refresh` (sending credentials/cookies). If successful, the new `authToken` is saved in `sessionStorage`.

### 3. Client-Side Spreadsheet Parsing (`BulkUploadForm.js`)
To simplify large-scale imports, the bulk upload manager processes Excel files directly in the browser:
*   **Spreadsheet Parsing**: Uses `xlsx` to parse `.xlsx` and `.xls` files.
*   **Real-Time Data Table Previews**: Dynamically reads sheets named "Assets", "Employees", and "Roles" and transforms them into JSON objects. It renders a clean grid preview of these objects *before* committing the payload to the server.
*   **Formatted Template Downloads**: Programmatically creates an Excel document with headers and sample data, letting administrators download the exact required format in a single click.

### 4. Custom Data Utilities
*   **`useTableSort.js`**: Centralizes alphabetical/numerical ordering across tables. Returns sort configuration states and sorting indicators.
*   **`usePagination.js`**: Handles calculation of total pages, current chunk boundaries, and indices for clean navigation across thousands of entries.

---

## 🖥️ Detailed Component Reference

### Core & Auth Routing
*   **`LogIn.js`**: Standard login portal. Validates email formats, requests authentication from the server, and stores the user token, role, and permissions list in `sessionStorage`.
*   **`ForgotPassword.js`**: Orchestrates forgot-password triggers and accepts tokenized URLs to securely perform password updates.
*   **`DashboardLayout.js`**: Serves as the central shell. Implements a responsive animated sidebar with navigation paths driven by permissions, a real-time badge counting pending borrow requests, and an interactive **User Profile Modal** allowing users to update their credentials and change passwords securely.

### Administrative Console (`src/components/Admin/`)
*   **`AdminDashboard.js`**: Fetches server stats to display live counters (Total Assets, Assigned Assets, Available Assets, Broken Assets, Employees, Pending Requests) alongside warning status charts.
*   **`AdminAssets.js`**: Renders assets in a tabular view with sorting and pagination. Features interactive forms to add/edit assets, status indicators (Available, Assigned, Maintenance), and filters.
*   **`AdminEmployees.js`**: Displays registered employees. Blocks manual edits to crucial identifiers (e.g. Employee ID) to maintain data integrity. Includes a button to trigger account activation link creation.
*   **`AdminAssignments.js`**: Lists active allocations. Enables admins to quickly return assets to the general pool.
*   **`AdminRequests.js`**: Shows pending request forms from employees. Approving an asset automatically flags it as assigned and runs backend validations to auto-reject overlapping pending requests for the same asset.
*   **`AdminReports.js`**: Aggregates damage alerts raised by employees. Allows admins to update maintenance states and record resolved issues.
*   **`AdminRoles.js`**: Allows creating custom roles and configuring granular permissions dynamically.

### Employee Dashboard (`src/components/Employee/`)
*   **`EmployeeAssets.js`**: Displays a card interface showing assets currently checked out to the logged-in employee.
*   **`EmployeeStatus.js`**: Allows employees to request to borrow assets, check the status of their requests (Pending, Approved, Rejected), and submit return requests.
*   **`EmployeeReport.js`**: A simplified form letting employees report asset damage directly from their portal, which updates the administrative reports view in real-time.
*   **`EmployeeHistory.js`**: Renders a chronological history of the employee's borrow history, including dates, request resolutions, and returns.

---

## 🚀 Getting Started & Scripts

In the `frontend` folder, you can run the following scripts:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page will automatically reload if you edit the code.

### `npm run build`
Builds the production bundle into the `build` directory. It optimizes, minifies, and hashes assets for performance.

### `npm test`
Launches the interactive Jest test runner.
