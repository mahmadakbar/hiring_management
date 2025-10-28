// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware(_req) {
//     // Additional middleware logic here if needed
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Define which routes require authentication
//         const { pathname } = req.nextUrl;
//         // Public routes that don't require authentication
//         const publicRoutes = ["/login", "/register", "/"];
//         // If it's a public route, allow access
//         if (publicRoutes.some(route => pathname.startsWith(route))) {
//           return true;
//         }
//         // For protected routes, check if user has a token
//         return !!token;
//       },
//     },
//   }
// );

// default middleware configuration
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect root path to job-list
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/job-list", request.url));
  }

  return NextResponse.next(); // Continue the request
}

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
