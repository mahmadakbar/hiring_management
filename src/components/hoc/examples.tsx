// ============================================
// RBAC Quick Reference Examples
// ============================================

import { RoleGuard, withRoleAccess, useHasRole } from "@/components/hoc";
import { Button } from "@/components/atoms/button";

// ============================================
// 1. RoleGuard Component (Inline Usage)
// ============================================

// Show only to admins
export function Example1() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div>Admin Only Content</div>
    </RoleGuard>
  );
}

// Show only to users
export function Example2() {
  return (
    <RoleGuard allowedRoles={["user"]}>
      <div>User Only Content</div>
    </RoleGuard>
  );
}

// Show to both admins and users
export function Example3() {
  return (
    <RoleGuard allowedRoles={["admin", "user"]}>
      <div>Content for all authenticated users</div>
    </RoleGuard>
  );
}

// With fallback
export function Example4() {
  return (
    <RoleGuard allowedRoles={["admin"]} fallback={<div>Access Denied</div>}>
      <div>Admin Panel</div>
    </RoleGuard>
  );
}

// ============================================
// 2. withRoleAccess HOC (Reusable Components)
// ============================================

// Create admin-only button
const AdminButton = withRoleAccess(Button, ["admin"]);

export function Example5() {
  return (
    <AdminButton onClick={() => console.log("Admin action")}>
      Delete User
    </AdminButton>
  );
}

// Create user-only button
const UserButton = withRoleAccess(Button, ["user"]);

export function Example6() {
  return (
    <UserButton onClick={() => console.log("User action")}>
      Apply Now
    </UserButton>
  );
}

// ============================================
// 3. useHasRole Hook (Conditional Logic)
// ============================================

export function Example7() {
  const isAdmin = useHasRole(["admin"]);
  const isUser = useHasRole(["user"]);

  return (
    <div>
      {isAdmin && <p>Welcome, Admin!</p>}
      {isUser && <p>Welcome, User!</p>}

      <button disabled={!isAdmin}>Admin Only Action</button>
    </div>
  );
}

// ============================================
// 4. Mixed Approach (Complex Scenarios)
// ============================================

export function Example8() {
  const isAdmin = useHasRole(["admin"]);

  return (
    <div className={isAdmin ? "admin-theme" : "user-theme"}>
      <h1>Dashboard</h1>

      {/* Admin section */}
      <RoleGuard allowedRoles={["admin"]}>
        <section>
          <h2>Admin Controls</h2>
          <Button>Manage Users</Button>
          <Button>View Reports</Button>
        </section>
      </RoleGuard>

      {/* User section */}
      <RoleGuard allowedRoles={["user"]}>
        <section>
          <h2>My Applications</h2>
          <Button>View Jobs</Button>
          <Button>My Profile</Button>
        </section>
      </RoleGuard>

      {/* Shared section with conditional features */}
      <section>
        <h2>Settings</h2>
        <Button>Update Profile</Button>
        {isAdmin && <Button>System Settings</Button>}
      </section>
    </div>
  );
}

// ============================================
// 5. Real-World: Navigation Menu
// ============================================

export function NavigationMenu() {
  const isAdmin = useHasRole(["admin"]);

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>

      <RoleGuard allowedRoles={["admin"]}>
        <a href="/admin/users">Manage Users</a>
        <a href="/admin/jobs">Manage Jobs</a>
        <a href="/admin/reports">Reports</a>
      </RoleGuard>

      <RoleGuard allowedRoles={["user"]}>
        <a href="/jobs">Browse Jobs</a>
        <a href="/applications">My Applications</a>
      </RoleGuard>

      {isAdmin && <span className="badge">Admin</span>}
    </nav>
  );
}

// ============================================
// 6. Real-World: Job Card with Role Actions
// ============================================

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const isAdmin = useHasRole(["admin"]);

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.description}</p>

      {/* Admin actions */}
      <RoleGuard allowedRoles={["admin"]}>
        <div className="admin-actions">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
          <Button>View Applicants</Button>
        </div>
      </RoleGuard>

      {/* User actions */}
      <RoleGuard allowedRoles={["user"]}>
        <div className="user-actions">
          <Button>Apply Now</Button>
          <Button variant="outline">Save</Button>
        </div>
      </RoleGuard>

      {/* Show different details based on role */}
      {isAdmin ? (
        <div className="admin-stats">
          <span>Applicants: 25</span>
          <span>Views: 1,245</span>
        </div>
      ) : (
        <div className="user-info">
          <span>Posted 2 days ago</span>
        </div>
      )}
    </div>
  );
}
