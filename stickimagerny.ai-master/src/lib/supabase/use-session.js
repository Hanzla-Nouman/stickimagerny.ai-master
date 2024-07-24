"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";

export default function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const getSession = async () => {
      const result = await supabase.auth.getSession();

      setSession(result.data ? result.data.session : null);
    };

    getSession();
  }, []);

  return session;
}