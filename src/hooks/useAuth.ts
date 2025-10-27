import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    logout,
  };
}
