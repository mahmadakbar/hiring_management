"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { GoogleLogo, KeyIcon, MailIcon } from "@assets/icon";
import { Button } from "@components/atoms/button";
import { Form } from "@components/atoms/form";
import { FormLoginData } from "@interfaces/forms";
import { loginSchema } from "@lib/schema/authSchema";
import { FormInput } from "@components/molecules/Form";
import { useCheckEmail, useLogin } from "@services/mutation/authMutation";
import { toast } from "@components/atoms/sonner";

export default function FormLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: checkEmail, isPending: isCheckingEmail } =
    useCheckEmail();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const form = useForm<FormLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const result = await signIn("google", {
        callbackUrl: "/job-list",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to sign in with Google. Please try again.");
      } else if (result?.ok) {
        toast.success("Successfully signed in!");
        // Use window.location for full page refresh
        window.location.href = result?.url || "/job-list";
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission (for email/password login if you want to implement it)
  async function onSubmit(values: FormLoginData) {
    try {
      if (!values.password) {
        toast.error("Password is required");
        return;
      }

      await login({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
        setErrorMessage("Username atau password salah, silakan coba lagi");
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    }
  }

  const handleCheckEmail = async () => {
    const email = form.watch("email");
    console.log("Form values:", email);
    try {
      setIsLoading(true);
      // Check if email exists in Supabase using mutation
      await checkEmail(email);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full min-w-[500px] bg-white p-10 shadow-sm backdrop-blur-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col justify-center gap-4"
        >
          <div className="mb-2">
            <h1 className="mb-2 text-xl font-semibold">Masuk ke Rakamin</h1>
            <p className="text-sm">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-font-secondary font-normal hover:underline"
              >
                Daftar menggunakan email
              </a>
            </p>
          </div>

          {errorMessage && (
            <div className="border-destructive bg-destructive-foreground mb-4 rounded-md border p-3">
              <p className="text-destructive text-xs">{errorMessage}</p>
            </div>
          )}

          <FormInput
            form={form}
            name="email"
            label="Alamat email"
            placeholder=""
            type="email"
          />

          {usePassword && (
            <FormInput
              form={form}
              name="password"
              label="Kata sandi"
              placeholder=""
              type="password"
            />
          )}

          <div className="flex w-full flex-col gap-4">
            {usePassword ? (
              <Button
                type="submit"
                className="h-auto rounded-lg py-2 text-base font-semibold"
                disabled={isLoading || isCheckingEmail || isLoggingIn}
              >
                {isLoggingIn ? "Masuk..." : "Masuk"}
              </Button>
            ) : (
              <Button
                type="button"
                className="h-auto rounded-lg py-2 text-base font-semibold"
                disabled={isLoading || isCheckingEmail || isLoggingIn}
                onClick={() => handleCheckEmail()}
              >
                {isLoading || isCheckingEmail ? "Mengirim..." : "Kirim link"}
              </Button>
            )}

            <div className="flex h-5 w-full items-center">
              <span className="bg-border-grey m-auto h-px w-full" />
              <span className="text-border-grey mx-2 w-[100px] text-center text-sm">
                or
              </span>
              <span className="bg-border-grey m-auto h-px w-full" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setUsePassword(!usePassword)}
              disabled={isLoading || isCheckingEmail || isLoggingIn}
              className="border-border text-font-primary hover:bg-border/20 flex h-auto items-center justify-center gap-3 rounded-lg bg-transparent px-6 py-3 font-bold shadow-none"
            >
              {usePassword ? <MailIcon /> : <KeyIcon />}
              <span className="text-base">
                {usePassword
                  ? "Kirim link login melalui email"
                  : "Masuk dengan kata sandi"}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isCheckingEmail || isLoggingIn}
              className="border-border text-font-primary hover:bg-border/20 flex h-auto items-center justify-center gap-3 rounded-lg bg-transparent px-6 py-3 font-bold shadow-none"
            >
              <GoogleLogo width={24} height={24} />
              <span className="text-base">
                {isLoading ? "Masuk..." : "Masuk dengan Google"}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
