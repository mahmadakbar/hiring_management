import { toast } from "@components/atoms/sonner";
import { TBodyRegister } from "@interfaces/api";
import { apiRegister, apiCheckEmail, apiLogin } from "@services/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { handleRegistrationError } from "@utils";
import { signIn, useSession } from "next-auth/react";

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TBodyRegister) =>
      apiRegister(data.email, data.name, data.password),
    onSuccess: data => {
      // Invalidate queries or update the cache after a successful registration
      queryClient.setQueryData(["user"], data.user);
      toast.success("Pendaftaran berhasil! Silakan login.");
      router.push("/login");
    },
    onError: error => {
      // Use global error handler
      handleRegistrationError(error);
    },
  });
};

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) => apiCheckEmail(email),
    onSuccess: data => {
      if (data.exists) {
        toast.success("Link login telah dikirim ke email Anda!");
        // TODO: Implement magic link sending logic here
      } else {
        toast.error("Email tidak terdaftar. Silakan daftar terlebih dahulu.");
      }
    },
    onError: error => {
      console.error("Check email error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // Sign in with NextAuth (this also verifies credentials via authorize function)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/job-list",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error("Login failed");
      }

      return result;
    },
    onSuccess: async data => {
      toast.success("Login berhasil!");

      // Small delay to ensure session cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use Next.js router for smooth navigation
      // The session will be automatically available via SessionProvider
      router.push(data?.url || "/job-list");
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Email atau password salah";
      toast.error(errorMessage);
    },
  });
};
