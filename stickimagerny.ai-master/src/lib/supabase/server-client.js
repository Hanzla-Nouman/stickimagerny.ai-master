import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getCookie, setCookie } from "cookies-next";

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component = false) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookies().get(name) ? cookies().get(name).value : undefined;
        },
        set(name, value, options) {
          if (component) return;
          cookies().set(name, value, options);
        },
        remove(name, options) {
          if (component) return;
          cookies().set(name, "", options);
        },
      },
    }
  );
}

export function createSupabaseServerComponentClient() {
  return createSupabaseServerClient(true);
}

export function createSupabaseReqResClient(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return getCookie(name, { req, res });
        },
        set(name, value, options) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name, options) {
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}