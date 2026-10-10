import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Host-based routing plus Control auth.
 *
 * - control.grupov3x.com.br (CONTROL_HOST): serves only the Control. "/" opens the
 *   workspace, public site pages redirect to the main domain, everything is noindex.
 * - Main domain: once CONTROL_HOST is configured, /control and /login move to the
 *   subdomain (308), so the Control is no longer reachable from the public site.
 * - With Supabase configured, /control requires a session (refreshed here).
 *   Authorization is enforced again on the server and by RLS in the database.
 */
const CONTROL_HOST = process.env.CONTROL_HOST?.toLowerCase();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://grupov3x.com.br";
const CONTROL_PATHS = /^\/(control|login|api\/control)(\/|$)/;

export async function proxy(request: NextRequest) {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0]!.toLowerCase();
  const path = request.nextUrl.pathname;
  const onControlHost = !!CONTROL_HOST && host === CONTROL_HOST;

  if (CONTROL_HOST && !onControlHost && (host === "grupov3x.com.br" || host === "www.grupov3x.com.br") && /^\/(control|login)(\/|$)/.test(path)) {
    return NextResponse.redirect(new URL(`${path}${request.nextUrl.search}`, `https://${CONTROL_HOST}`), 308);
  }

  if (onControlHost && !CONTROL_PATHS.test(path)) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/control";
      return withNoIndex(NextResponse.redirect(url));
    }
    return NextResponse.redirect(new URL(`${path}${request.nextUrl.search}`, SITE_URL), 308);
  }

  if (!CONTROL_PATHS.test(path)) return NextResponse.next();
  const response = await authenticate(request, NextResponse.next({ request }), path);
  return onControlHost ? withNoIndex(response) : response;
}

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

async function authenticate(request: NextRequest, base: NextResponse, path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return base;

  let response = base;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user && path.startsWith("/control")) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?next=${encodeURIComponent(path)}`;
    response = NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  // Every page (the control host needs "/" and redirects of public pages), but not static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|mp4|webm|txt|xml|woff2?)$).*)"],
};
