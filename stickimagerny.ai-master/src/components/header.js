"use client";
import React, { useState, useEffect, useContext } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Tabs,
  Tab,
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  Kbd,
  DropdownItem,
} from "@nextui-org/react";
import UserMenu from "./userMenu";
import useSession from "@/lib/supabase/use-session";
import { usePathname, useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { CreditsContext } from "@/context/CreditsContext";
import HeaderNavigation from "./headerNavigation";

const navigation = [
  { name: "Stock", href: "#" },
  { name: "Art", href: "#" },
  { name: "Logo", href: "#" },
  { name: "Social Media", href: "#" },
  { name: "Wallpaper", href: "#" },
  // { name: "3D", href: "#" },
  // { name: "Face Swap", href: "#" },
];

export default function Header(props) {
  const supabaseClient = createSupabaseBrowserClient();
  const session = useSession();
  const user = session?.user;
  const { userCredits } = useContext(CreditsContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userCreditsValue, setUserCreditsValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {

  // }, [userCredits]);

  return (
    <>
      <header className="border-bottom rounded-md">
        <nav
          className="grid grid-cols-3 items-center pb-2 lg:px-2"
          aria-label="Global"
        >
          {/* <div className="justify-self-start">
            <Tabs
              items={navigation}
              selectedKey={props.imageType}
              onSelectionChange={props.setImageType}
              disabledKeys={["3D", "Face Swap"]}
            >
              {(item) => (
                <Tab key={item.name} title={item.name} />
              )}
            </Tabs>
             </div> */}
          <div className="flex flex-col  mb-2">
            {/* <label className="text-xs text-gray-600 mb-1">Current Tool</label> */}

            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" size='sm' color="secondary">
         
                  <>
                  Current Tool: {" "}    
                    {(() => {
                      //const path = window.location.pathname;
                      // if (path.includes("motion")) {
                      //   return path.split("/").pop();
                      // } else {
                        const tool = pathname.split("/")[2];
                        switch (tool) {
                          case "image":
                            return "Text to Image";
                          case "upscaler":
                            return "Upscaler";
                          case "motion":
                            if (pathname.includes("animate")) {
                              return "Text to Video";
                            } else if (pathname.includes("imagevideo")) {
                              return "Image to Video";
                            } else {
                              return "Motion";
                            }
                          case "faceswap":
                            return "Face Swap";
                          default:
                            return tool || "";
                        // }
                      }
                    })()}
                  </>
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </Button>
                {/* <Button
                  size="sm"
                  className="capitalize w-full"
                  color="secondary"
                  variant="flat"
                  endContent={
                    <svg
                      fill="none"
                      height="14"
                      viewBox="0 0 24 24"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  {key}
                </Button> */}
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Template selection"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[pathname]}
                onAction={(key) => router.push(key)}
                className="w-full"
              >
                <DropdownItem
                  key="/generate/image"
                  description="Generate AI images"
                >
                  Generate Image
                </DropdownItem>
                <DropdownItem key="/generate/upscaler" description="Upscale images to high definition">
                  Upscale
                </DropdownItem>
                <DropdownItem
                  key="/generate/motion/animate"
                  description="Transform a sentence into a video"
                >
                  Text to Video
                </DropdownItem>
                <DropdownItem
                  key="/generate/motion/imagevideo"
                  description="Transform an image into a video"
                >
                  Image to Video
                </DropdownItem>
                <DropdownItem key="/generate/faceswap" description="Swap faces between two images">
                  Face Swap
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* <HeaderNavigation/> */}
          </div>
          <div></div>{" "}
          {/* This empty div is needed to create space between the tabs and the user info */}
          <div className="justify-self-end flex items-center gap-x-6">
            <span className="text-sm text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              {userCredits > 5000 ? "∞" : userCredits}
            </span>
            <Button
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
              }
              size="sm"
              color="secondary"
              onClick={() => props.setOpenModal(true)}
            >
              Unlock Pro
            </Button>
            <UserMenu />
          </div>
        </nav>
      </header>
    </>
  );
}
