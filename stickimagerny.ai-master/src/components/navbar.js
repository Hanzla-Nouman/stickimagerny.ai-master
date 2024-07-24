"use client";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserMenu from "./userMenu";
import { usePathname } from 'next/navigation'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname()
  return (
    <Disclosure as="nav" style={{ backgroundColor: '#ffecfb' }}>
    {({ open }) => (
      <>
        <div className="mx-auto pt-3 max-w-7xl px-4 sm:px-6 lg:px-8 border-r-5">
          <div className="flex h-16 justify-between items-center ">
            <div className="flex-shrink-0">
              <h2 className="text-xl text-black font-semibold bg-white border border-black rounded-full px-5 py-2">
                Stock Imagery<span className="text-red-500">.</span>AI
              </h2>
            </div>
            <div className="flex-grow flex justify-center">
              <div className="flex space-x-8 text-xl text-black font-semibold bg-white border border-black rounded-full px-5 py-2">
                <a
                  href="/"
                  className={`inline-flex items-center px-1 text-sm font-medium ${
                    pathname === "/"
                      ? "border-b-2 border-indigo-500 text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Home
                </a>
                <a
                  href="/generate/image"
                  className="inline-flex items-center border-b-2 border-transparent px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Create
                </a>
                <a
                  href="/pricing"
                  className={`inline-flex items-center px-1 text-sm font-medium ${
                    pathname === "/pricing"
                      ? "border-b-2 border-indigo-500 text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Pricing
                </a>
              </div>
            </div>
            <div className="flex-shri">
              <UserMenu /> maintain
            </div>
          </div>
        </div>
      </>
    )}
  </Disclosure>

  );
}
