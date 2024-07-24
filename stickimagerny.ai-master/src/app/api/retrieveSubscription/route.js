import { lemonSqueezyApiInstance } from "@/lib/lemon-squeezy";

export const dynamic = "force-dynamic";

export async function GET(req) {
 
  try {
    //console.log(JSON.stringify(req))
    const subscriptionId = req.nextUrl.searchParams.get('subscriptionId');
    //const subscriptionId = req.query.subscriptionId;
    console.log(`Subscription ID: ${subscriptionId}`);

    if (!subscriptionId) {
      return Response.json(
        { message: "subscriptionId is required" },
        { status: 400 }
      );
    }
    console.log("API CALLED")

    const response = await lemonSqueezyApiInstance.get(`/subscriptions/${subscriptionId}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      }
    });

    console.log(response.data);

    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "An error occured" }, { status: 500 });
  }
}