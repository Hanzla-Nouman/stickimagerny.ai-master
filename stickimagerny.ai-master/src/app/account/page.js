"use client";
import Navbar from "@/components/navbar";
import UpgradeModal from "@/components/upgradeModal";

import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Listbox, ListboxItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import useSession from "@/lib/supabase/use-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function Account() {
  const supabaseClient = createSupabaseBrowserClient();
  const user = useSession()?.user;

  const [url, setUrl] = useState(null);

  useEffect(() => {
 

    const fetchSubscriptionId = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("user_credits")
          .select("subscription_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching subscription ID:", error);
          return;
        }

        const subscriptionId = data[0].subscription_id;

        const response = await fetch(`/api/retrieveSubscription?subscriptionId=${subscriptionId}`, {
          method: "GET",
        });
        const responseData = await response.json();

        setUrl(responseData['data']['attributes']['urls']['customer_portal']);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSubscriptionId();
  }, [user]);
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
          <h1 className="text-2xl text-gray-700 mb-4 text-center">Settings</h1>
          <hr className="mb-6" />

          <div className="mb-6">
            <h2 className="text-xl  text-gray-700 mb-4">Subscription</h2>
            {/* <p className="mb-4 text-sm">
              You are on the Basic plan. You have 100 credits left.
            </p> */}
            <div className="flex space-x-4">
              <Button
                isDisabled={!user?.id || !url}
                size="sm"
                onClick={() => window.open(url, "_blank")}
              >
                Manage Subscription
              </Button>
            </div>
          </div>
          <hr className="mb-6" />

          <div className="mb-12">
            <h2 className="text-xl text-gray-700 mb-4">Account</h2>
            <Input isDisabled size="sm" type="text" placeholder={user?.email} />
          </div>
          {/* <hr className="mb-6" /> */}

          {/* <div>
            <h2 className="text-xl text-gray-700 mb-2">Delete Your Account</h2>
            <Button size="sm">Delete</Button>
          </div> */}
        </div>
      </div>
    </>
  );
}
