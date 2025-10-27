"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { GoogleLogo } from "@assets/icon";
import { Button } from "@components/atoms/button";
import { Form } from "@components/atoms/form";
import { FormLoginData, FormRegisterData } from "@interfaces/forms";
import { registerSchema } from "@lib/schema/authSchema";
import { FormInput } from "@components/molecules/Form";

export default function FormRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormRegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to sign in with Google. Please try again.");
      } else if (result?.ok) {
        // Check if user is authenticatedW
        const session = await getSession();
        if (session) {
          toast.success("Successfully signed in!");
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission (for email/password login if you want to implement it)
  function onSubmit(values: FormLoginData) {
    // For now, just log the values
    // You can implement email/password authentication here if needed
    console.log("Form values:", values);
    toast.info(
      "Email/password login not implemented yet. Please use Google sign in."
    );
  }

  return (
    <div className="flex h-full w-full min-w-[500px] bg-white p-10 shadow-sm backdrop-blur-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col justify-center gap-4"
        >
          <div className="mb-2">
            <h1 className="mb-2 text-xl font-semibold">
              Bergabung dengan Rakamin
            </h1>
            <p className="text-sm">
              Sudah punya akun?{" "}
              <a
                href="/login"
                className="text-font-secondary font-normal hover:underline"
              >
                Masuk
              </a>
            </p>
          </div>

          <FormInput
            form={form}
            name="email"
            label="Alamat email"
            placeholder=""
            type="email"
          />

          <div className="flex w-full flex-col gap-4">
            <Button
              type="submit"
              className="bg-button-primary hover:bg-button-primary/90 text-font-natural h-auto rounded-lg py-2 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar dengan email"}
            </Button>

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
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="border-border text-font-primary hover:bg-border/20 flex h-auto items-center justify-center gap-3 rounded-lg bg-transparent px-6 py-3 font-bold shadow-none"
            >
              <GoogleLogo width={24} height={24} />
              <span className="text-base">
                {isLoading ? "Memproses..." : "Daftar dengan Google"}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
