import LoginTemplate from "@components/templates/LoginTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return <LoginTemplate />;
}
