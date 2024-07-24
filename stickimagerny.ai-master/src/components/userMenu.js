"use client";
import useSession from "@/lib/supabase/use-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";

import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";

export default function UserMenu() {
    const supabase = createSupabaseBrowserClient();
    const session = useSession();
    const user = session?.user;
    const router = useRouter();

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login")
    };

  return (
    <>
    {user ? 
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            color="default" 
            name={user?.user_metadata?.full_name?.charAt(0)}
            className="transition-transform"
            //src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="settings" href="/account">
            My Settings
          </DropdownItem>
   
          <DropdownItem key="affiliate" href="https://stockimagery.lemonsqueezy.com/affiliates">
            Become an Affiliate
          </DropdownItem>
          <DropdownItem key="logout" color="danger"  onPress={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
     
    </div> : null}
    </>
  );
}
