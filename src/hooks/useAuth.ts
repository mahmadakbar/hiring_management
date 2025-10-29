import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  console.log("USE AUTH SESSION:", session);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const role = session?.user?.role;

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    logout,
    role,
  };
}
