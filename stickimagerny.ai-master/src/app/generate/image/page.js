"use client";
import { useState, useEffect, createRef } from "react";
import { useSearchParams } from "next/navigation";
import * as fal from "@fal-ai/serverless-client";
import DropdownNextUI from "../../../components/dropdown";
import {
  Slider,
  Select,
  SelectItem,
  Textarea,
  Accordion,
  AccordionItem,
  Switch,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  Kbd,
  DropdownItem,
  Divider,
} from "@nextui-org/react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import {
  callFalFoocus,
  callStableDiffusion3,
  downloadImage,
  generateUUID,
} from "@/utils";
import Notification from "@/components/notification";
import useSession from "@/lib/supabase/use-session";
import UpgradeModal from "@/components/upgradeModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { CreditsContext } from "@/context/CreditsContext";
import ImagePicker from "@/components/imagePicker";

const aspectRatios = [
  { label: "Square", value: "square" },
  { label: "Square HD", value: "square_hd" },
  { label: "Portrait 4 x 3", value: "portrait_4_3" },
  { label: "Portrait 16 x 9", value: "portrait_16_9" },
  { label: "Landscape 4 x 3", value: "landscape_4_3" },
  { label: "Landscape 16 x 9", value: "landscape_16_9" },
];

const Generate = () => {
  const supabaseClient = createSupabaseBrowserClient();

  fal.config({
    proxyUrl: "/api/fal/proxy",
  });

  const user = useSession()?.user;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    useSearchParams().get("searchTerm")
  );
  const [searchTerm, setSearchTerm] = useState(
    useSearchParams().get("searchTerm")
  );
  const [searchResults, setSearchResults] = useState([
    { searchTerm: "", images: [] },
  ]);
  const [loading, setLoading] = useState(null);
  const [userCredits, setUserCredits] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [start, setStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [imageType, setImageType] = useState("Stock");

  const [aspectRatio, setAspectRatio] = useState(aspectRatios[1].value);
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState("1024");
  const [style, setStyle] = useState("");
  const [numImages, setNumImages] = useState(4);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(4);
  const [sharpness, setSharpness] = useState(2);
  const [safetyCheck, setSafetyCheck] = useState(true);
  const [error, setError] = useState(false);
  const [fileName, setFileName] = useState();
  const [controlImage, setControlImage] = useState();
  const [isOpen, setIsOpen] = useState(false);

  let fileInputRef = createRef();

  useEffect(() => {
    async function fetchData() {
      await getUserGenerations(user?.id);
      await fetchUserCredits(user?.id);
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    if (loading && start === null) {
      setStart(Date.now());
    } else if (!loading && start !== null) {
      setStart(null);
    }
  }, [loading]);

  useEffect(() => {
    if (start !== null) {
      const interval = setInterval(() => {
        setElapsed(Date.now() - start);
      }, 1);
      return () => clearInterval(interval);
    } else {
      setElapsed(0);
    }
  }, [start]);

  useEffect(() => {
    switch (aspectRatio) {
      case "square":
        setWidth("512");
        setHeight("512");
        break;
      case "square_hd":
        setWidth("1024");
        setHeight("1024");
        break;
      case "portrait_4_3":
        setWidth("768");
        setHeight("1024");
        break;
      case "portrait_16_9":
        setWidth("576");
        setHeight("1024");
        break;
      case "landscape_4_3":
        setWidth("1024");
        setHeight("720");
        break;
      case "landscape_16_9":
        setWidth("1024");
        setHeight("576");
        break;

      default:
        break;
    }
  }, [aspectRatio]);

  useEffect(() => {
    if (imageType == "Stock" || imageType == "Art" || imageType == "Logo") {
      //setStyle();
      setNegativePrompt(
        "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3)"
      );
    } else {
      setStyle("dummy");
      setNegativePrompt(
        "cartoon, painting, illustration, (worst quality, low quality, normal quality:2)"
      );
    }
  }, [imageType]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        (event.metaKey || event.ctrlKey) &&
        !loading &&
        style &&
        searchValue
      ) {
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, style, searchValue]);

  async function saveImageGeneration(
    prompt,
    negativePrompt,
    imageStyle,
    imageType,
    imageUrls,
    generateId
  ) {
    const insertions = imageUrls.map((image) => ({
      user_id: user.id,
      generate_id: generateId,
      prompt,
      negative_prompt: negativePrompt || null,
      image_style: imageStyle || null,
      image_type: imageType || null,
      image_url: image.url,
    }));

    const { data, error } = await supabaseClient
      .from("user_generations")
      .insert(insertions);

    if (error) {
      console.error("Error saving image data:", error);
    } else {
      console.log("Image data saved successfully");
    }
  }

  async function saveImageR2(uuid, image, index) {
    const url = "/api/storeImage"; // Replace with your actual API endpoint
    const data = {
      uuid: uuid, // Replace with your actual UUID
      image: image,
    };
    if (index !== undefined) {
      data.index = index;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function deductCredits(userId, numImages) {
    const { data, error } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error retrieving user credits:", error);
      return;
    }

    const currentCredits = data.credits;
    const newCredits = Math.max(0, currentCredits - numImages);

    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating user credits:", updateError);
    } else {
      console.log("User credits updated successfully");
      setUserCredits(newCredits); // State update after search
    }
  }

  async function fetchUserCredits(userId) {
    const { data, error } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user credits:", error);
    } else {
      setUserCredits(data[0].credits);
    }
  }

  async function getUserGenerations(userId) {
    const { data, error } = await supabaseClient
      .from("user_generations")
      .select(
        "generate_id, prompt, negative_prompt, image_style, image_type, image_url, created_at"
      )
      .filter(
        "image_type",
        "in",
        '("Stock","Logo","Art","Wallpaper","Stable Diffusion 3")'
      )
      .eq("user_id", userId)

      .order("created_at", { ascending: false }); // Order by created_at descending

    if (error) {
      console.error("Error retrieving user image data:", error);
      return [];
    } else {
      const groupedData = data.reduce((acc, curr) => {
        const {
          generate_id,
          prompt,
          negative_prompt,
          image_style,
          image_type,
          image_url,
        } = curr;
        if (!acc[generate_id]) {
          acc[generate_id] = {
            prompt,
            negative_prompt: negative_prompt || null,
            images: [],
          };
        }
        acc[generate_id].images.push({ url: image_url });
        return acc;
      }, {});

      const searchResults = Object.values(groupedData).map(
        ({ prompt, negative_prompt, images }) => ({
          searchTerm: prompt,
          negative_prompt,
          images,
        })
      );

      setSearchResults(searchResults);
      return searchResults;
    }
  }

  const handleSearch = async (e) => {
    if (userCredits < numImages) {
      setOpenModal(true);
    } else {
      try {
        await deductCredits(user.id, numImages);
        setSearchTerm(searchValue);
        setLoading(true);
        const generateId = generateUUID();
        //Upload image if image is provided
        let uploadedImageUrl;
        if (fileName) {
          const imageFormData = new FormData();
          imageFormData.append("file", fileName);
          const imageUploadResponse = await fetch("/api/storeImageBinary", {
            method: "POST",
            body: imageFormData,
          });
          const imageUploadResult = await imageUploadResponse.json();
          uploadedImageUrl = imageUploadResult.url; // adjust as needed
        }

        let result;
        switch (imageType) {
          case "Stock":
          case "Art":
          case "Logo":
            if (uploadedImageUrl || controlImage) {
              result = await callFalFoocus(
                searchValue,
                style,
                width,
                height,
                guidanceScale,
                sharpness,
                numImages,
                negativePrompt,
                safetyCheck,
                uploadedImageUrl ? uploadedImageUrl : controlImage
              );
            } else {
              result = await callFalFoocus(
                searchValue,
                style,
                width,
                height,
                guidanceScale,
                sharpness,
                numImages,
                negativePrompt,
                safetyCheck
              );
            }
            break;
          case "Stable Diffusion 3":
            result = await callStableDiffusion3(
              searchValue,
              aspectRatio,
              "",
              guidanceScale,
              negativePrompt,
              numImages,
              safetyCheck
            );
            break;
          case "Wallpaper":
            result = await callStableDiffusion3(
              "Wallpaper image " + searchValue,
              aspectRatio,
              "",
              guidanceScale,
              negativePrompt,
              numImages,
              safetyCheck
            );
            break;
        }

        const imageUrls = [];
        for (const [index, image] of result.images.entries()) {
          const responseImageR2 = await saveImageR2(generateId, image, index);
          imageUrls.push(responseImageR2);
        }

        setSearchResults((prevResults) => [
          { searchTerm: searchValue, images: imageUrls },
          ...prevResults,
        ]);
        await saveImageGeneration(
          searchValue,
          negativePrompt,
          style,
          imageType,
          imageUrls,
          //result.images,
          generateId
        );
      } catch (error) {
        console.error("An error occurred while fetching images:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {openModal && (
        <UpgradeModal openModal={openModal} setOpenModal={setOpenModal} />
      )}
      {error && <Notification error={error} setError={setError} />}

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4  overflow-y-auto bg-slate-50 p-4 border rounded-md flex-col relative">
          <div>
            <div className="flex lg:flex-1 items-center justify-start">
              <a href="/" className="flex items-center">
                <Button
                  startContent={
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
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                  }
                  size="sm"
                  variant="light"
                ></Button>
                <h2 className="text-xl text-gray-900 font-semibold  ml-4">
                  stockimagery<span className="text-red-500">.</span>ai
                </h2>
              </a>
            </div>

            <label
              htmlFor="comment"
              className="mt-10 block text-sm font-medium leading-6 text-white-900"
            >
              Model
            </label>
            <p className="text-xs text-default-500 mb-2">
              Select base model used for generations
            </p>

            <div className="mt-2 ">
              <Dropdown
                backdrop="blur"
                classNames={{
                  base: "before:bg-default-200 w-full", // change arrow background
                  content:
                    "w-full py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                }}
              >
                <DropdownTrigger>
                  <Button
                    size="sm"
                    className="capitalize w-full"
                    color="default"
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
                    {imageType}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={imageType}
                  onAction={setImageType}
                  className="w-full"
                >
                
                  <DropdownItem
                    key="Stock"
                    description="Good for hyper realism and faces"
                  >
                    Stock
                  </DropdownItem>
                  <DropdownItem
                    key="Art"
                    description="Good for anime, art and unique styles"
                  >
                    Art
                  </DropdownItem>
                  <DropdownItem key="Logo" description="Good for logo design">
                    Logo
                  </DropdownItem>
                  <DropdownItem
                    key="Stable Diffusion 3"
                    description="Most powerful stable diffusion model. 
Good for displaying text in images."
                  >
                    Stable Diffusion 3
                  </DropdownItem>
               
                  {/* <DropdownItem key="Wallpaper">Wallpaper</DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            </div>
            <label
              htmlFor="comment"
              className="mt-5 block text-sm font-medium leading-6 text-white-900"
            >
              {"Prompt " + imageType}
            </label>
            {/* <p className="text-small text-default-500 mb-2">Enter a prompt</p> */}

            <div className="">
              <Textarea
                minRows={4}
                size="sm"
                // label="Prompt"
                aria-label="prompt"
                placeholder="Enter your prompt"
                value={searchValue || ""}
                onValueChange={setSearchValue}
                className="w-full mt-4 mb-4"
              />
            </div>

            {imageType !== "Stable Diffusion 3" &&
              imageType !== "Wallpaper" && (
                <>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Style
                  </label>
                  <p className="text-xs text-default-500 mb-2">
                    Style applies presets and LORA's to the image model
                  </p>
                  <div className="mt-2 mb-8">
                    <DropdownNextUI imageType={imageType} setStyle={setStyle} />
                  </div>
                </>
              )}
            {imageType !== "Stable Diffusion 3" &&
              imageType !== "Wallpaper" && (
                <>
                  {/* <Divider /> */}
                  {/* <Accordion isCompact  selectedKeys={fileName || controlImage ? ["1"]: null}>
                  
                  <AccordionItem key="1" aria-label="Accordion 1" title="+ Add Control Image">
                    <div className="mt-2 mb-8 relative">
                      <ImagePicker fileName={fileName} setFileName={setFileName} controlImage={controlImage} setControlImage={setControlImage} fileInputRef={fileInputRef}/>              
                    </div>
                  </AccordionItem>
                </Accordion> */}
                  <div className=" bg-slate-50">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full text-left text-small font-medium py-2 text-gray-900 focus:outline-none"
                    >
                      {isOpen || fileName || controlImage ? "Add Control Image -" : "Add Control Image +"}
                      <p className="mt-1 font-normal text-xs text-default-500 mb-2">
                    Click to choose an image to then influence the features of your generation
                  </p>
                    </button>
                
                    {(isOpen || fileName || controlImage) && (
                      <div className="mt-2 mb-8 relative">
                        <ImagePicker
                          fileName={fileName}
                          setFileName={setFileName}
                          controlImage={controlImage}
                          setControlImage={setControlImage}
                          fileInputRef={fileInputRef}
                        />
                      </div>
                    )}
                  </div>
                  {/* <Divider /> */}
                </>
              )}
            <label className="mt-5 block text-sm font-medium leading-6 text-gray-900">
              Aspect Ratio
            </label>
            <p className="text-xs text-default-500 mb-2">
                    Select the resolution of the final images
                  </p>
            <div className="mt-2 mb-8 flex justify-between">
              <Select
                value={aspectRatio}
                defaultSelectedKeys={["square_hd"]}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="max-w-40"
                aria-label="aspectRatio"
                size="sm"
              >
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </Select>

              <div>
                <Input
                  isDisabled
                  value={width}
                  size="sm"
                  onChange={(e) => setWidth(e.target.value)}
                  // className="max-w-4"
                  aria-label="width"
                />
              </div>
              <span className="mt-2 mx-1">x</span>
              <div>
                <Input
                  isDisabled
                  value={height}
                  size="sm"
                  onChange={(e) => setHeight(e.target.value)}
                  // className="max-w-4"
                  aria-label="height"
                />
              </div>
            </div>

            {/* <label className="block text-sm font-medium leading-6 text-gray-900">
          Number of Images
        </label> */}
            <div className=" mb-8">
              <Slider
                label="Number of Images"
                size="sm"
                maxValue={4}
                step={1}
                aria-label="numimages"
                minValue={1}
                defaultValue={4}
                value={numImages}
                onChange={setNumImages}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <Accordion isCompact>
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                 subtitle="Press to expand"
                title="Advanced Settings"
              >
                <div className="mt-2 mb-8">
                  <Textarea
                    label="Negative Prompt"
                    placeholder="Negative Prompt"
                    value={negativePrompt}
                    onValueChange={setNegativePrompt}
                    defaultValue={negativePrompt}
                  ></Textarea>
                </div>
                <div className="mb-8">
                <p className="text-xs text-default-500 mb-2">The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt. Default: 4</p>

                  <Slider
                    label="Guidance Scale"
                    size="sm"
                    maxValue={30}
                    step={1}
                    aria-label="guidance"
                    minValue={1}
                    defaultValue={4}
                    value={guidanceScale}
                    onChange={setGuidanceScale}
                    color="foreground"
                    classNames={{
                      label:
                        "block text-sm font-medium leading-6 text-gray-900",
                    }}
                    className="max-w-md"
                  />
                </div>
                <div className="mb-8">
                <p className="text-xs text-default-500 mb-2">Use it to control how sharp the generated image should be. Higher value means image and texture are sharper.  Default: 2</p>

                  <Slider
                    label="Sharpness"
                    size="sm"
                    maxValue={30}
                    aria-label="sharpness"
                    step={1}
                    minValue={0}
                    defaultValue={2}
                    value={sharpness}
                    onChange={setSharpness}
                    color="foreground"
                    classNames={{
                      label:
                        "block text-sm font-medium leading-6 text-gray-900",
                    }}
                    className="max-w-md"
                  />
                </div>
                <div>
                  <p className="text-xs text-default-500 mb-2">Disabling the safety checker will also deactivate the explicit content filter.</p>
                  <Switch
                    size="sm"
                    color="secondary"
                    isSelected={safetyCheck}
                    onValueChange={setSafetyCheck}
                    defaultSelected
                  >
                    Safety Checker
                  </Switch>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
      <div className="mb-20 mx-auto w-full flex justify-center ">
          <Button
            onClick={handleSearch}
            type="button"
            color="secondary"
            variant="shadow"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffff"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
            }
            isDisabled={loading || !(style && searchValue)}
            className="fixed w-80 bottom-0 mt-8 mb-8 rounded-md pl-4 pr-2 py-1"
          >

            <div className="flex flex-row items-center w-full">
              <div className="text-lg">Generate</div>
              <div className="ml-auto">
                {typeof window !== "undefined" &&
                /Mac/i.test(window.navigator.platform) ? (
                  <Kbd
                    className="bg-purple-500 border border-purple-400 text-white text-xs rounded"
                    keys={["command"]}
                  >
                    + Enter
                  </Kbd>
                ) : (
                  <Kbd
                    className="bg-transparent text-white border-white border-1"
                    keys={["ctrl", "enter"]}
                  >
                    G
                  </Kbd>
                )}
              </div>
            </div>
          </Button>
          </div>
        </div>
        <div className=" w-full md:w-3/4 p-4 overflow-y-auto h-screen  bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="hidden sm:block mb-4">
            <CreditsContext.Provider value={{ userCredits, setUserCredits }}>
              <Header
                imageType={imageType}
                setImageType={setImageType}
                setOpenModal={setOpenModal}
              />
            </CreditsContext.Provider>
          </div>
          {loading ? (
            <>
              <div
                className="flex justify-center space-x-4"
                //className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
              >
                {Array.from({ length: numImages }).map((_, index) => (
                  <div
                    key={index}
                    role="status"
                    className="flex flex-col justify-center items-center group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only text-gray-500">Loading...</span>
                    {(elapsed / 1000).toFixed(1)}
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {searchResults.map((result, index) => (
            <div key={index}>
              {
                <h2 className="text-lg text-slate-500 font-bold mb-4">
                  &quot;{result.searchTerm}&quot;
                </h2>
              }
              <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
              >
                {result.images.map(
                  (image, index) =>
                    image.url && (
                      <li key={image.url} className="relative">
                        <div className="group aspect-h-7 aspect-w-10 block w-full overflow-x-auto rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <Image
                            src={image.url}
                            width={500}
                            height={500}
                            alt=""
                            unoptimized
                            className="pointer-events-none object-cover group-hover:opacity-75"
                          />
                          <div className="flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
                              <a
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="focus:outline-none"
                                title="Open Image in New Tab"
                              >
                                <span className="text-center">
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
                                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                  </svg>
                                </span>
                              </a>
                              <button
                                onClick={() => downloadImage(image.url)}
                                className="focus:outline-none"
                                title="Download Image"
                              >
                                <span className="text-center">
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
                                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                    />
                                  </svg>
                                </span>
                              </button>
                              <button
                                onClick={() => setControlImage(image.url)}
                                className="focus:outline-none"
                                title="Use as control image"
                              >
                                <span className="text-center">
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
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Generate;
