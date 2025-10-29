"use client";

import { useAuth } from "@/hooks/useAuth";
import { NotFoundPage } from "@components/templates/NotFoundTemplate";
import LoadingTemplate from "@components/templates/LoadingTemplate";
import { ComponentType, ReactNode } from "react";

type UserRole = "user" | "admin";

interface RoleAccessProps {
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
  children?: ReactNode;
}

/**
 * Higher-Order Component (HOC) that wraps a component and only renders it
 * if the user has one of the allowed roles.
 *
 * @param Component - The component to wrap
 * @param allowedRoles - Array of roles that are allowed to see the component
 * @param fallback - Optional fallback to render when user doesn't have access
 *
 * @example
 * const AdminOnlyButton = withRoleAccess(Button, ["admin"]);
 *
 * @example
 * const AdminOrUserButton = withRoleAccess(Button, ["admin", "user"]);
 */
export function withRoleAccess<P extends object>(
  Component: ComponentType<P>,
  allowedRoles: UserRole[],
  fallback?: ReactNode
) {
  return function RoleAccessComponent(props: P) {
    const { role, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
      return <LoadingTemplate />;
    }

    // Check if user has required role
    const hasAccess = role && allowedRoles.includes(role);

    if (!hasAccess) {
      return fallback ? (
        <div className="flex-1">{fallback}</div>
      ) : (
        <NotFoundPage />
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Component wrapper that conditionally renders children based on user role.
 * Useful for inline role-based rendering without creating HOCs.
 *
 * @example
 * <RoleGuard allowedRoles={["admin"]}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * <RoleGuard allowedRoles={["admin"]} fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  fallback,
  children,
}: RoleAccessProps) {
  const { role, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingTemplate />;
  }

  // Check if user has required role
  const hasAccess = role && allowedRoles && allowedRoles.includes(role);

  if (!hasAccess) {
    return fallback ? <div className="flex-1">{fallback}</div> : null;
  }

  return <>{children}</>;
}

/**
 * Utility hook to check if current user has specific role(s)
 *
 * @example
 * const isAdmin = useHasRole(["admin"]);
 * if (isAdmin) {
 *   // Show admin features
 * }
 */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const { role } = useAuth();
  return !!role && allowedRoles.includes(role);
}
