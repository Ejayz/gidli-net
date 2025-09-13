import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
export async function middleware(request: NextRequest) {
  const jwtSecret = process.env.JWT_SECRET || "";

  if (request.nextUrl.pathname == "/") {
    if (request.cookies.get("token")?.value) {
      const token = request.cookies.get("token")?.value || "";
      try {
        const verify = await jose.jwtVerify(
          token,
          new TextEncoder().encode(jwtSecret)
        );
        if (verify.payload) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
          return NextResponse.next();
        }
      } catch (e) {
        return NextResponse.next();
      }
    } else {
      return NextResponse.next();
    }
  }
  if (
    (request.nextUrl.pathname.startsWith("/api") &&
      !request.nextUrl.pathname.startsWith("/api/new_customer")) ||
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    if (request.cookies.get("token")?.value) {
      const token = request.cookies.get("token")?.value || "";
      try {
        const verify = await jose.jwtVerify(
          token,
          new TextEncoder().encode(jwtSecret)
        );
        if (!verify.payload) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
