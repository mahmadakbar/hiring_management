import LoginTemplate from "@components/templates/LoginTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  // Middleware handles the redirect if user is already logged in
  return <LoginTemplate />;
}
