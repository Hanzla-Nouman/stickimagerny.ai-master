import { NextResponse } from "next/server";
import { createSupabaseReqResClient } from "./lib/supabase/server-client";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const result = await supabase.auth.getSession();

  const user = result.data && result.data.session ? result.data.session.user : undefined;

  // protects the "/account" route and its sub-routes
  // if (!user && request.nextUrl.pathname.startsWith("/generate")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  if (!user && request.nextUrl.pathname.startsWith("/generate")) {
    const redirectUrl = new URL("/login", request.url);
    const pathWithQuery = request.nextUrl.pathname;

    redirectUrl.searchParams.append('x-url', pathWithQuery);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)","/", "/generate"],
};