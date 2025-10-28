import "@assets/styles/globals.css";
import Container from "@components/templates/Container";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

const dmSans = Nunito_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hiring Management",
    template: "%s | Hiring Management",
  },
  description:
    "Simple and efficient hiring management system to streamline your recruitment process.",
};

export default function RootLayout({ children }: Readonly<ChildrenProps>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} bg-white antialiased`}>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
