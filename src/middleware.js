// middleware.js
import { NextResponse } from "next/server";

// Detail routes that have a static public page + a dynamic /preview twin.
// `?preview=<token>` requests are rewritten to the twin so the public page
// stays statically generated/cached and only previewers pay for SSR.
const PREVIEWABLE_PATH = /^\/(market|posts|project)\/[^/]+\/?$/;

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Preview rewrite — keep the ?preview=<token> URL, render via the dynamic twin.
  if (searchParams.has("preview") && PREVIEWABLE_PATH.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `/preview${pathname}`;
    return NextResponse.rewrite(url);
  }

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
