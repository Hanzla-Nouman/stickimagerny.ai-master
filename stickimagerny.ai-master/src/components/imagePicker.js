import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import useSession from "@/lib/supabase/use-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import Image from "next/image";

function ImagePicker({
  fileName,
  setFileName,
  controlImage,
  setControlImage,
  fileInputRef,
}) {
  const supabaseClient = createSupabaseBrowserClient();

  let [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("yourImages");
  const [userImages, setUserImages] = useState([]);

  const user = useSession()?.user;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    async function fetchUserImages() {
      const { data, error } = await supabaseClient
        .from("user_generations")
        .select("image_url")
        .filter(
          "image_type",
          "in",
          '("Stock","Logo","Art","Wallpaper","Social Media")'
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error retrieving user image data:", error);
        return;
      }
      setUserImages(data.map((item) => item.image_url));
    }

    if (user) {
      fetchUserImages();
    }
  }, [user]);

  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center"> */}
      <div
        onClick={openModal}
        className="w-full h-48 flex items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        {fileName || controlImage ? (
          <span className="relative">
            {fileName ? (
              <>
                <img
                  src={URL.createObjectURL(fileName)}
                  alt={fileName.name}
                  className="w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48"
                />
                <button
                  onClick={() => setFileName(null)}
                  className="absolute top-0 right-0  text-white rounded-full p-1"
                >
                  X
                </button>
              </>
            ) : controlImage ? (
              <>
                <img
                  src={controlImage}
                  alt="control image"
                  className="w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48"
                />
                <button
                  onClick={() => setControlImage(null)}
                  className="absolute top-0 right-0  text-white rounded-full p-1"
                >
                  X
                </button>
              </>
            ) : (
              "Drag an image or click here"
            )}
          </span>
        ) : (
          <>
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
            <p>Choose Image</p>
          </>
        )}
      </div>
      {/* </div> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xxl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex space-x-4 border-b-2 border-gray-200 pb-2">
                    <button
                      onClick={() => setTab("yourImages")}
                      className={`px-4 py-2 ${
                        tab === "yourImages"
                          ? "text-blue-900 font-semibold border-b-2 border-blue-900"
                          : "text-gray-500"
                      }`}
                    >
                      Your Images
                    </button>
                    <button
                      onClick={() => setTab("uploadImage")}
                      className={`px-4 py-2 ${
                        tab === "uploadImage"
                          ? "text-blue-900 font-semibold border-b-2 border-blue-900"
                          : "text-gray-500"
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>

                  <div className="relative mt-4 h-[65vh]">
                    {tab === "yourImages" ? (
                      <>
                        {userImages.length < 1 && (
                          <p className="text-center w-full">
                            Your generated images will appear here.
                          </p>
                        )}

                        <div className="grid grid-cols-6 gap-4 h-full overflow-auto">
                          {userImages.map((image, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setControlImage(image);
                                setFileName();
                                closeModal();
                              }}
                              className="w-full h-full object-cover rounded-md focus:outline-none"
                            >
                              <Image
                                src={image}
                                width={500}
                                height={500}
                                alt=""
                                className="pointer-events-none object-cover group-hover:opacity-75"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="file"
                          id="imageUpload"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFileName(file);
                            }
                          }}
                          ref={fileInputRef}
                        />
                        <label
                          htmlFor="imageUpload"
                          className="cursor-pointer  p-4 w-full text-center"
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) {
                              setFileName(file);
                            }
                          }}
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                              />
                            </svg>
                            <span>
                              {fileName
                                ? fileName.name
                                : "Drag an image or click here"}
                            </span>
                          </div>
                        </label>
                        {fileName && (
                          <button
                            className="absolute top-0 right-0 mt-2 mr-2  text-black rounded-full h-6 w-6 flex items-center justify-center"
                            onClick={() => {
                              setFileName(null);
                              setControlImage(null);
                              fileInputRef.current.value = null; // Clear the input value
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ImagePicker;
