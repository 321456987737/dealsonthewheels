import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    // Authentication is handled by withAuth.
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === "admin";
      },
    },

    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/cars/:path*",
    "/admin/inquiries/:path*",
    "/admin/test-drives/:path*",
    "/admin/settings/:path*",
  ],
};