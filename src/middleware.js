// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("authToken")?.value;

  const privateRoutes = [
    "/account",
    "/change-password",
    "/quotes-history",
    "/saved-products",
  ];

  const authenticationRoutes = ["/login", "/create-account"];
  if (privateRoutes.includes(pathname) && !authToken) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (authenticationRoutes.includes(pathname) && authToken && pathname !== "/account") {
    return NextResponse.redirect(new URL("/account", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    {
      source: "/((?!_next|favicon.ico|assets|public|api).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
