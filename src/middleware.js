// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Preview rewrite — keep the public ?preview=<token> URL static/cached, and
  // render drafts via the dynamic /preview/* twin. The rewrite is generic: any
  // previewable path maps to /preview<path> (home "/" -> /preview/home), so no
  // per-route mapping is maintained here. `preview` is only ever the token
  // param, and the guard prevents re-rewriting an already-rewritten request.
  if (searchParams.has("preview") && !pathname.startsWith("/preview")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/preview/home" : `/preview${pathname}`;
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
