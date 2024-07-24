"use server";

import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";


import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function login(formData, url) {
  const supabase = createSupabaseServerClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    //return new NextResponse.JSON({ error: error });
    return { success: false, message: error };

    // redirect("/auth/auth-error");
  }

  revalidatePath("/", "layout");
  redirect(url);
}

export async function signup(formData, url) {
  console.log(url);

  const supabase = createSupabaseServerClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      data: {
        display_name: formData.get("fullname"),
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    return { success: false, message: error };
  } else {
    return { success: true, message: "Check confirmation link in email" };
  }
}
