import "next-auth";
import "next-auth/jwt";

declare global {
  interface ChildrenProps {
    children: React.ReactNode;
  }

  type ErrorPageProps = Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
  }>;
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
  }
}

// SVG module declarations
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

export {};
