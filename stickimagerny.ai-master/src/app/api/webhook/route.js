import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(req) {
  const supabase = createSupabaseServerClient();

  try {
    // Catch the event type
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const body = await req.json();

    // Check signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      hmac.update(await clonedReq.text()).digest("hex"),
      "utf8"
    );
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    //console.log(body);

    // Logic according to event
    if (eventType === "subscription_created") {
      const userId = body.meta.custom_data.user_id;
      const subscriptionId = body.data.id;
      const isSuccessful = body.data.attributes.status === "paid";
      const variantId = body.data.attributes.variant_id;
      console.log("VARIANT ID" + variantId);
      if (variantId == "286315") {
        await supabase
          .from("user_credits")
          .update({
            plan: "essential",
            credits: 5000,
            subscription_id: subscriptionId,
          })
          .match({ user_id: userId });
      } else if (variantId == "294933") {
        await supabase
          .from("user_credits")
          .update({
            plan: "pro",
            credits: 100000,
            subscription_id: subscriptionId,
          })
          .match({ user_id: userId });
      }
    }
    if (eventType === "subscription_updated") {
        console.log("SUBSCRIPTION UPDATED WEBHOOK CALLED")
        const userId = body.meta.custom_data.user_id;
      const status = body.data.attributes.status;
      const subscriptionId = body.data.id;
      const variantId = body.data.attributes.variant_id;
      if (status === "expired") {
        //put 0 credits
        await supabase
          .from("user_credits")
          .update({
            plan: "free",
            credits: 0,
            subscription_id: null,
          })
          .match({ user_id: userId });
      }
      if (status === "active") {
        const { data: existingCredits, error } = await supabase
          .from("user_credits")
          .select("plan")
          .eq("user_id", userId)
          .single();

        if (
          !(
            (variantId == "294933" && existingCredits.plan == "pro") ||
            (variantId == "286315" && existingCredits.plan == "essential")
          )
        ) {
            console.log("SUBSCRIPTION UPDATED")

          // Execute actions if the variant ID and plan do not match the specified conditions
          let newPlanDetails = {};
          if (variantId == "294933") {
            newPlanDetails = { plan: "pro", credits: 100000 };
          } else if (variantId == "286315") {
            newPlanDetails = { plan: "essential", credits: 5000 };
          }
          await supabase
            .from("user_credits")
            .update({
              plan: newPlanDetails.plan,
              credits: newPlanDetails.credits,
              subscription_id: subscriptionId,
            })
            .match({ user_id: userId });
        }
        // check which variant and update DB. In db check which variant already exists and do nothing if the same
      }

      //Delete subscription
      //Upgrade subscription
    }

    return Response.json({ message: "Webhook received" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
