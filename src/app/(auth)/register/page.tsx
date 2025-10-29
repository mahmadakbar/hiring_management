import RegisterTemplate from "@components/templates/RegisterTemplate";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Register() {
  const session = await getServerSession();

  // Redirect to job-list if user is already logged in
  if (session) {
    redirect("/job-list");
  }

  return <RegisterTemplate />;
}
