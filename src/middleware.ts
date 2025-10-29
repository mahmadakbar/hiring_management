import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Debug log (remove in production)
    console.log("Middleware - Path:", pathname, "Has Token:", !!token);

    // Redirect authenticated users away from auth pages
    const authPages = ["/login", "/register"];
    if (token && authPages.some(page => pathname.startsWith(page))) {
      console.log("Redirecting authenticated user from auth page to /job-list");
      return NextResponse.redirect(new URL("/job-list", req.url));
    }

    // Redirect root path to job-list
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/job-list", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = ["/login", "/register"];

        // Debug log (remove in production)
        console.log("Auth Check - Path:", pathname, "Token exists:", !!token);

        // Allow public routes - middleware will handle authenticated user redirects
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // For protected routes, check if user has a token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
