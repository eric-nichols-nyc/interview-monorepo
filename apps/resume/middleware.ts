import { authMiddleware } from "@repo/auth/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/");

  return authMiddleware(request, {
    onUnauthenticated: (request) => {
      // If user is not authenticated and trying to access protected routes (including root)
      if (!isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/sign-in";
        return NextResponse.redirect(url);
      }
      return NextResponse.next({ request });
    },
    onAuthenticated: (request, _user) => {
      // If user is authenticated and trying to access auth pages, redirect to home
      if (isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
      // Return null to continue with default auth middleware response
      return null;
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
