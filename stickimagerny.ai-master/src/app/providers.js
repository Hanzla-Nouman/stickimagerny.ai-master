"use client";

import { NextUIProvider } from "@nextui-org/react";
import Script from "next/script";

function lemonHanlder(evt) {
  // console.info("lemon event", evt);
  // console.log(JSON.stringify(LemonSqueezy))

  if (evt.event === "Checkout.Success") {
    // do something after checkout success.
  }
}

function LemonPay({ handler }) {
  function lemonLoaded() {
    window.createLemonSqueezy();
    const affiliateID = LemonSqueezy.Affiliate.GetId();
    // const urlWithAffiliateID = LemonSqueezy.Affiliate.Build(
    //   "https://stockimagery.ai"
    // );
    console.log("Affiliate ID:", affiliateID);
    //console.log("URL with Affiliate ID:", urlWithAffiliateID);
    LemonSqueezy.Setup({
      eventHandler: (event) => {
        if (handler) {
          handler(event);
        }
      },
    });

   
  }
  return (
    <Script
      src="https://app.lemonsqueezy.com/js/lemon.js"
      onLoad={lemonLoaded}
    ></Script>
  );
}

export function Providers({ children }) {
  return (
    <>
      <LemonPay handler={lemonHanlder} />
      <NextUIProvider>{children}</NextUIProvider>
    </>
  );
}
