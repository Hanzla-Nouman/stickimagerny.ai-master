"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as fal from "@fal-ai/serverless-client";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import CardTest from "@/components/cardTest";
import DynamicTitle from "@/components/dynamicTitle";
import FeatureSection from "@/components/featureSection";
import TrustSection from "@/components/trustSection";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

const navigation = [
  {
    name: "Stock",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
  },
  {
    name: "Art",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
        />
      </svg>
    ),
  },
  {
    name: "Logo",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
        />
      </svg>
    ),
  },
  {
    name: "Social Media",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    name: "Wallpaper",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    ),
  },
];

const Home = () => {
  const items = new Array(10).fill(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [imageType, setImageType] = useState("Stock");

  const router = useRouter();

  fal.config({
    proxyUrl: "/api/fal/proxy",
  });

  const handleSearch = () => {
    router.push(`/generate?searchTerm=${searchTerm}`);
  };

  return (
    <div className="border-black border-3"> 
      <Navbar />
      <div className="flex items-center justify-center mb-0">
        {/* <a href="https://www.producthunt.com/posts/stockimagery-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-stockimagery-ai" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=455487&theme=light" alt="StockImagery.ai - Simplest way to generate hyper-realistic AI visuals & art | Product Hunt" style={{ width: '180px', height: '38px' }} width="180" height="38" />
      </a> */}
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen  space-y-8 w-full mx-auto">
        <div style={{ backgroundColor: "#ffecfb" }}>
          <DynamicTitle />

          <div className=" flex flex-col items-center h-1/2">
            <div className="w-full max-w-7xl sm:w-11/12 sm:p-16 sm:mx-16 backdrop-filter backdrop-blur-5xl sm:rounded-xl  ">
              <CardTest />
            </div>
          </div>

          <TrustSection />
          <FeatureSection
            showDetailsOnRight={false}
            mainTitle={"Generate Hyper Realistic Images"}
            description={
              "Explore your creative potential with our advanced AI, designed to turn your concepts into highly realistic images. Ideal for artists, designers, and creative minds."
            }
            src={
              "https://image.lexica.art/full_webp/05fe3236-e2cb-493a-ae0c-1d2fcf1be41c"
            }
            link={"/generate/image"}
          />
          <FeatureSection
            showDetailsOnRight={true}
            mainTitle={"Create Moving Images"}
            description={
              "Transform static images into captivating motion videos. Bring your photos to life and add a dynamic touch to your visual storytelling."
            }
            src={
              "https://image.lexica.art/full_webp/05fe3236-e2cb-493a-ae0c-1d2fcf1be41c"
            }
            link={"/generate/motion/imagevideo"}
          />
          <FeatureSection
            showDetailsOnRight={false}
            mainTitle={"Create Videos Just From Text"}
            description={
              "Enter a simple text prompt and watch as our AI transforms it into a captivating short video, styled in any way you choose. Perfect for quick content creation and storytelling."
            }
            src={
              "https://image.lexica.art/full_webp/0a53a97f-388a-4cda-aecd-ff08dae4090e"
            }
            link={"/generate/motion/animate"}
          />
          <FeatureSection
            showDetailsOnRight={true}
            mainTitle={"Upscale Images To Super High Definition"}
            description={
              "Enhance your images with our advanced upscaler, designed to transform your photos into high-definition masterpieces with stunning clarity and detail."
            }
            src={"/clothesTry.jpg"}
            link={"/generate/upscaler"}
          />

          <FeatureSection
            showDetailsOnRight={false}
            mainTitle={
              "Generate High Quality Stock Photos for your Blog or Website"
            }
            description={
              "Create bespoke, high-quality images tailored specifically for your blog or website. Simply input your desired theme or subject, and let our AI generate unique, eye-catching visuals that enhance your digital presence."
            }
            src={"cakeReal.jpg"}
            link={"/generate/image"}
          />
<div className="bg-cyan-">
          <div className="mt-10 flex justify-center items-center h-32">
            <h1 className="text-4xl font-montas font-semibold text-gray-800 text-center ">
              Show Case
            </h1>
          </div>
          <div className=" sm:hidden  mb-5 w-full flex justify-center">
            <Select
              // label="Select an animal"
              className="max-w-xs"
              variant="underlined"
              selectedKeys={[imageType]}
              onChange={(e) => setImageType(e.target.value)}
            >
              {navigation.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="  mb-20 justify-center flex ">
          
           <div className="border-1 border-black bg-white p-4 rounded-full">
               {navigation.map(i =>( 
                <span className="mx-2 bg-pink-500 px-4 py-2 rounded-full ">{i.name}</span>
                ))}
           </div>
          </div>
          </div>
          <div>
            <div
              // className="w-full px-8  max-w-7xl "
              className="w-11/12 mx-11 p-6 bg-opacity-0 backdrop-filter backdrop-blur-5xl rounded-lg border-2 border-gray-300 border-opacity-100"
            >
              <ul
                role="list"
                className="grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
              >
                {items.map((_, index) => (
                  <li key={index} className="relative">
                    <div className="group aspect-h-5 aspect-w-8 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                      <Image
                        src={
                          "/" +
                          imageType +
                          "/image" +
                          String(index + 1) +
                          ".webp"
                        }
                        loading="lazy"
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="w-full h-auto pointer-events-none object-cover group-hover:opacity-75 "
                        alt=""
                      />  

                      <button
                        type="button"
                        className="absolute inset-0 focus:outline-none"
                      >
                        <span className="sr-only">
                          View details for IMG_4985.HEIC
                        </span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-shrink-0 items-center">
              <h2 className="text-xl text-gray-900  font-semibold ">
                stockimagery<span className="text-red-500">.</span>ai
              </h2>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a
                  href="https://stockimagery.lemonsqueezy.com/affiliates"
                  className="hover:underline me-4 md:me-6"
                >
                  Become an Affiliate
                </a>
              </li>
              <li>
                <a
                  href="/generate/image"
                  className="hover:underline me-4 md:me-6"
                >
                  Generate Image
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:underline me-4 md:me-6">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/stockimageryai"
                  className="hover:underline me-4 md:me-6"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="mailto:team@stockimagery.ai"
                  className="hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
