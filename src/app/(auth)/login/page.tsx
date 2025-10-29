import LoginTemplate from "@components/templates/LoginTemplate";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Login() {
  const session = await getServerSession();

  // Redirect to job-list if user is already logged in
  if (session) {
    redirect("/job-list");
  }

  return <LoginTemplate />;
}
