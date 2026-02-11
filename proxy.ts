import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import User from "./models/User";

export default auth(async (request) => {
  await dbConnect();
  const isLoggedIn = !!request.auth;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname == "/login";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  const user = await User.findOne({ email: request.auth?.user?.email });

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn) {
    if ((isLoginPage || pathname == "/register") && user) {
      return NextResponse.redirect(new URL(`/dashboard/admin`, request.url));
    } else if (isLoginPage && !user) {
      return NextResponse.redirect(new URL("/register", request.url));
    } else if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
});

// apply middleware on only important routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
