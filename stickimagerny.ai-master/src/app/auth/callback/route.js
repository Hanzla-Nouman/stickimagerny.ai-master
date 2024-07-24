import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

async function handleUserCredits(user, supabase) {
  // Check if the user already exists in the user_credits table
  const { data: userCreditsData, error: userCreditsError } = await supabase
    .from("user_credits")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (userCreditsError) {
    console.error("Error fetching user credits:", userCreditsError);
    throw new Error("Error fetching user credits");
  }

  // If the user doesn't exist in the user_credits table, set up their initial credits
  if (!userCreditsData) {
    const initialCredits = 12; // Set the initial credits for the free plan
    const { error: insertError } = await supabase
      .from("user_credits")
      .insert([{ user_id: user.id, credits: initialCredits, plan: "free" }]);

    if (insertError) {
      console.error("Error setting up initial credits:", insertError);
      throw new Error("Error setting up initial credits");
    }
  }
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  // if "next" is in param, use it in the redirect URL
  const next = searchParams.get("next") ? searchParams.get("next") : "/";
  console.log("NEXT URL: " + next);

  if (code) {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getUser()
      const user = data.user;
      console.log(user)

      try {
        await handleUserCredits(user, supabase);
      } catch (error) {
        return new NextResponse.JSON({ error: error.message });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return new NextResponse.JSON({ error: "Your error message" });
  //return NextResponse.redirect(`${origin}/auth/auth-error`);
}