import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required to keep it alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Auth routes (sign-in, sign-up, forgot-password, onboarding) are public
  const isAuthRoute =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth/callback");

  // If no user and trying to access a protected page → redirect to sign-in
  // NOTE: We keep the demo mode flow — if user has no session they still
  // reach the app (mock data). We only redirect if NEXT_PUBLIC_DATA_MODE is
  // 'supabase' and a user session is explicitly required.
  // For now: let all routes through, but refresh session.
  // Uncomment the block below to enforce auth-gating:

  // if (!user && !isAuthRoute) {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = "/sign-in";
  //   redirectUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // If user is signed in and hits sign-in page → redirect to dashboard
  if (user && (pathname === "/sign-in" || pathname === "/sign-up")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
