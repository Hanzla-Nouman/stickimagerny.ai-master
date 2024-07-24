"use client";
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
} from "@nextui-org/react";
import { useState, useEffect, createRef } from "react";
import { callCCSR, downloadImage, generateUUID } from "@/utils";
import ReactCompareImage from "react-compare-image";
import { CreditsContext } from "@/context/CreditsContext";
import Header from "@/components/header";
import UpgradeModal from "@/components/upgradeModal";
import useSession from "@/lib/supabase/use-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import Notification from "@/components/notification";
import ImagePicker from "@/components/imagePicker";

import * as fal from "@fal-ai/serverless-client";

function Upscaler() {
  const supabaseClient = createSupabaseBrowserClient();

  fal.config({
    proxyUrl: "/api/fal/proxy",
  });

  const user = useSession()?.user;
  const [upscaleImages, setUpscaleImages] = useState([
    {
      inputImage: "https://source.unsplash.com/random/1",
      resultImage: "https://source.unsplash.com/random/1",
    },
    {
      inputImage: "https://source.unsplash.com/random/2",
      resultImage: "https://source.unsplash.com/random/2",
    },
    {
      inputImage: "https://source.unsplash.com/random/3",
      resultImage: "https://source.unsplash.com/random/3",
    },
  ]);
  let fileInputRef = createRef();

  const [baseImage, setBaseImage] = useState(null);
  const [controlImage, setControlImage] = useState();

  const [baseImageUrl, setBaseImageUrl] = useState();
  const [resultImageUrl, setResultImageUrl] = useState();
  const [scale, setScale] = useState(2);
  const [tileDiffusion, setTileDiffusion] = useState("mix");
  const [tileDiffusionSize, setTileDiffusionSize] = useState(1024);
  const [tileDiffusionStride, setTileDiffusionStride] = useState(512);
  const [tileVae, setTileVae] = useState(false);
  const [tileVaeDecoderSize, setTileVaeDecoderSize] = useState(226);
  const [tileVaeEncoderSize, setTileVaeEncoderSize] = useState(1024);
  const [steps, setSteps] = useState(50);
  const [tMax, setTMax] = useState(0.6667);
  const [tMin, setTMin] = useState(0.3333);
  const [colorFixType, setColorFixType] = useState("none");

  const [loading, setLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [error, setError] = useState();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getUserGenerations(user?.id);
      await fetchUserCredits(user?.id);
    }
    fetchData();
  }, [user]);

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
        "generate_id, prompt, negative_prompt, image_style, image_type, image_url, input_image_url, created_at"
      )
      .eq("user_id", userId)
      .eq("image_type", "Upscale")
      .order("created_at", { ascending: false }); // Order by created_at descending

    if (error) {
      console.error("Error retrieving user image data:", error);
      return [];
    } else {
      const upscaleImageData = data.map((item) => {
        const { image_url, input_image_url } = item;
        return {
          inputImage: input_image_url,
          resultImage: image_url,
        };
      });

      console.log(JSON.stringify(upscaleImageData));

      setUpscaleImages(upscaleImageData);
      return upscaleImageData;
    }
  }

  async function saveImageGeneration(
    imageType,
    imageUrl,
    inputImageUrl,
    generateId
  ) {
    const insertion = {
      user_id: user.id,
      generate_id: generateId,
      prompt: null,
      negative_prompt: null,
      input_image_url: inputImageUrl || null,
      image_type: imageType || null,
      image_url: imageUrl,
    };

    const { data, error } = await supabaseClient
      .from("user_generations")
      .insert(insertion);

    if (error) {
      console.error("Error saving image data:", error);
    } else {
      console.log("Image data saved successfully");
    }
  }

  async function saveImageR2(uuid, image) {
    const url = "/api/storeImage"; // Replace with your actual API endpoint
    const data = {
      uuid: uuid, // Replace with your actual UUID
      image: image,
    };

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

  async function handleGenerate() {
    if (userCredits < 4) {
      setOpenModal(true);
    } else {
      // Reset baseImage and resultImageUrl states
      await deductCredits(user.id, 4);

      setBaseImageUrl(null);
      setResultImageUrl(null);

      let finalImageUrl;
      if (!controlImage) {
        const baseImageFormData = new FormData();
        baseImageFormData.append("file", baseImage);

        const baseImageResponse = await fetch("/api/storeImageBinary", {
          method: "POST",
          body: baseImageFormData,
        });

        const baseImageResult = await baseImageResponse.json();

        finalImageUrl = baseImageResult.url; // adjust as needed
        setBaseImageUrl(finalImageUrl);
      } else {
        finalImageUrl = controlImage;
      }

      // Set loading state to true
      setLoading(true);

      try {
        const generateId = generateUUID();
        const result = await callCCSR(
          finalImageUrl,
          scale,
          tileDiffusion,
          tileDiffusionSize,
          tileDiffusionStride,
          tileVae,
          tileVaeDecoderSize,
          tileVaeEncoderSize,
          steps,
          tMax,
          tMin,
          colorFixType
        );

        const responseImageUrl = result.image.url;
        setResultImageUrl(responseImageUrl);
        setUpscaleImages([
          { inputImage: finalImageUrl, resultImage: responseImageUrl },
          ...upscaleImages,
        ]);
        console.log(responseImageUrl);

        const responseImageR2 = await saveImageR2(generateId, result.image);
        await saveImageGeneration(
          "Upscale",
          responseImageR2.url,
          finalImageUrl,
          generateId
        );
      } catch (error) {
        setError(true);
        console.error(error);
      } finally {
        // Set loading state to false
        setLoading(false);
      }
    }
  }

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
                <h2 className="text-xl text-gray-900 font-semibold font-mono ml-4">
                  stockimagery<span className="text-red-500">.</span>ai
                </h2>
              </a>
            </div>
            <label
              htmlFor="comment"
              className="mt-10 block text-sm font-medium leading-6 text-white-900"
            >
              Base Image
            </label>
            <p className="text-xs text-default-500 mb-2">Choose an image to upscale</p>

            <div className="mb-8">
             
              <ImagePicker
                fileName={baseImage}
                setFileName={setBaseImage}
                controlImage={controlImage}
                setControlImage={setControlImage}
                fileInputRef={fileInputRef}
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">The higher the scale, the bigger the output image will be. Default value: 2</p>

              <Slider
                label="Scale"
                size="sm"
                maxValue={4}
                aria-label="scale"
                step={1}
                minValue={1}
                //defaultValue={}
                value={scale}
                onChange={setScale}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Tile Diffusion
            </label>
            <p className="text-xs text-default-500 mb-2">If specified, a patch-based sampling strategy will be used for sampling. Default value: none</p>

            <div className="mb-8">
              <Select
                value={tileDiffusion}
                defaultSelectedKeys={["none"]}
                onChange={(e) => setTileDiffusion(e.target.value)}
                className="max-w-40"
                aria-label="tileDiffusion"
                size="sm"
              >
                <SelectItem key="none" value="none">
                  None
                </SelectItem>
                <SelectItem key="mix" value="mix">
                  Mix
                </SelectItem>
                <SelectItem key="gaussian" value="gaussian">
                  Gaussian
                </SelectItem>
              </Select>
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">Size of patch. Default value: 1024</p>

              <Slider
                label="Tile Diffusion Size"
                size="sm"
                maxValue={2048}
                aria-label="tileDiffusionSize"
                step={1}
                minValue={256}
                value={tileDiffusionSize}
                onChange={setTileDiffusionSize}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
                          <p className="text-xs text-default-500 mb-2">Stride of sliding patch. Default value: 512</p>

              <Slider
                label="Tile Diffusion Stride"
                size="sm"
                maxValue={1024}
                aria-label="tileDiffusionStride"
                step={1}
                minValue={128}
                value={tileDiffusionStride}
                onChange={setTileDiffusionStride}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">If specified, a patch-based sampling strategy will be used for VAE decoding.</p>

              <Switch
                size="sm"
                color="secondary"
                isSelected={tileVae}
                onValueChange={setTileVae}
                defaultSelected
              >
                Tile VAE
              </Switch>
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">Size of VAE patch. Default value: 226</p>

              <Slider
                label="Tile VAE Decoder Size"
                size="sm"
                maxValue={2048}
                aria-label="tileVAEDecoderSize"
                step={1}
                minValue={64}
                value={tileVaeDecoderSize}
                onChange={setTileVaeDecoderSize}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">Size of latent image Default value: 1024</p>

              <Slider
                label="Tile VAE Encoder Size"
                size="sm"
                maxValue={2048}
                aria-label="tileVAEEncoderSize"
                step={1}
                minValue={128}
                value={tileVaeEncoderSize}
                onChange={setTileVaeEncoderSize}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">The higher the number of steps the better the quality and longer it will take to generate. Default value: 50</p>

              <Slider
                label="Steps"
                size="sm"
                maxValue={100}
                aria-label="steps"
                step={1}
                minValue={10}
                value={steps}
                onChange={setSteps}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">The ending point of uniform sampling strategy. Default value: 0.6667</p>

              <Slider
                label="T Max"
                size="sm"
                maxValue={1}
                aria-label="tMax"
                step={0.01}
                minValue={0}
                value={tMax}
                onChange={setTMax}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <div className="mb-8">
            <p className="text-xs text-default-500 mb-2">The starting point of uniform sampling strategy. Default value: 0.6667</p>
              <Slider
                label="T Min"
                size="sm"
                maxValue={1}
                aria-label="tMin"
                step={0.01}
                minValue={0}
                value={tMin}
                onChange={setTMin}
                color="foreground"
                classNames={{
                  label: "block text-sm font-medium leading-6 text-gray-900",
                }}
                className="max-w-md"
              />
            </div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Color Fix
            </label>
            <p className="text-xs text-default-500 mb-2">Type of color correction for samples. Default value: "adain"</p>

            <div className="mb-8">
              <Select
                value={colorFixType}
                onChange={(e) => setColorFixType(e.target.value)}
                className="max-w-40"
                aria-label="colorFix"
                size="sm"
                defaultSelectedKeys={["none"]}
              >
                <SelectItem key="none" value="none">
                  None
                </SelectItem>
                <SelectItem key="wavelet" value="wavelet">
                  Wavelet
                </SelectItem>
                <SelectItem key="adain" value="adain">
                  Adain
                </SelectItem>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              type="button"
              color="secondary"
              variant="shadow"
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
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              }
              isDisabled={
                (baseImage || controlImage) && !loading ? false : true
              }
              className={`sticky bottom-0 mt-8  w-full  mb-8 `}
            >
              Generate
            </Button>
          </div>
        </div>
        <div className=" w-full md:w-3/4 p-4 overflow-y-auto h-screen  bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="hidden sm:block mb-4">
            <CreditsContext.Provider value={{ userCredits, setUserCredits }}>
              <Header setOpenModal={setOpenModal} />
            </CreditsContext.Provider>
          </div>

          <div className="mb-5 flex justify-center items-center h-half w-1/2 m-auto bg-glass rounded-lg shadow-lg overflow-hidden">
            {loading && (
              <div
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
              </div>
            )}
          </div>

         
          <div className="flex flex-col justify-center mx-auto h-half w-1/2">
            {upscaleImages.map(({ inputImage, resultImage }, index) => (

              <div
                key={index}
                className="relative group mb-8 rounded-lg max-w-[500px] max-h-[500px]"
              >
                {inputImage && resultImage ? (
                  <>
                    <div className=" h-full w-full">
                      <ReactCompareImage
                        leftImage={inputImage}
                        rightImage={resultImage}
                        rightImageLabel="after"
                        leftImageLabel="before"
                      />
                    </div>
                    <div className="absolute top-0 right-0 flex items-start justify-end space-x-4 opacity-0 group-hover:opacity-100">
                      <a
                        href={resultImage}
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
                            className="w-8 h-8"
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
                        onClick={() => downloadImage(resultImage)}
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
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No image available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Upscaler;
