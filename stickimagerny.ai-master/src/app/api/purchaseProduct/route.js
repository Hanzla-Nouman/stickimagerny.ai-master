import { lemonSqueezyApiInstance } from "@/lib/lemon-squeezy";

export const dynamic = "force-dynamic";

export async function POST(req) {

  try {
    const reqData = await req.json();
    console.log(reqData);

    if (!reqData.productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    if (!reqData.userId) {
      return Response.json({ message: "userId is required" }, { status: 400 });
    }
    console.log("API CALLED")


   

    const response = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: reqData.userId,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: reqData.productId.toString(),
            },
          },
        },
      },
    });

    const checkoutUrl = response.data.data.attributes.url ;

    console.log(response.data);

    return Response.json({ checkoutUrl });
  } catch (error) {
    console.error(error);
    Response.json({ message: "An error occured" }, { status: 500 });
  }
}
