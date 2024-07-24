"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
export default function CardTest() {
  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div 
      //className="flex flex-col bg-white m-auto p-auto justify-center items-center"
      >

        <div id="carousel" className={`flex ${isMobile ? 'flex-col items-center' : 'overflow-x-auto'} pb-10 hide-scroll-bar ${isMobile ? '' : 'scroll-smooth snap-x snap-mandatory'}`}>
          <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-nowrap lg:ml-40 md:ml-20 ml-5 sm:ml-3'}`}>
            {[
              {
                header: "Foocus and Stable Diffusion",
                title: "Generate Image",
                imageSrc: "https://image.lexica.art/full_webp/59caa4d6-d676-45f8-b741-359081f60754",
                description: "Create hyper realistic photos, anime characters, watercolor paintings, sticker packs, logos, 3D characters and more",
                route: "/generate/image"
              },
              {
                header: "Stable Diffusion Video",
                title: "Motion",
                imageSrc: "/surfinganime.jpg",
                description: "Transform your images to moving photos",
                route: "generate/motion/imagevideo"
              },
              {
                header: "CSSR",
                title: "Upscaler",
                imageSrc: "https://image.lexica.art/full_webp/5f3ea0a4-b550-4e28-9bcf-12760de2a1c9",
                description: "Upscale your images to high definition",
                route: "/generate/upscaler"
              },
              {
                header: "Animate Diff",
                title: "Text to Video",
                imageSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhnc3RncWkyZXk5Y2g2YzNoZDBlM3ZkMGd2Ynl2bW8ybHpja3N3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fuu6MgeNKZEPwRCuXg/giphy.gif",
                description: "Create short 4 second videos using text",
                route: "/generate/motion/animate"
              },
              {
                header: "Stable Diffusion",
                title: "Face Swap",
                imageSrc: "https://image.lexica.art/full_webp/bd39243b-a4fd-449a-941e-08c13c3bb176",
                description: "Swap faces between two photos",
                route: "/generate/faceswap"
              },  
          
              // Additional cards...
            ].map((card, index) => (
              <div key={index} className={`inline-block px-3 ${isMobile ? '' : 'snap-center snap-always'}`}>
                <div className="w-80 h-80 max-w-sm overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <Card isFooterBlurred className="w-full h-full">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                      {/* <p className="text-tiny text-white/60 uppercase font-bold">
                        {card.header}
                      </p> */}
                      <h4 className="text-white/90 font-medium text-xl">{card.title}</h4>
                    </CardHeader>
                    <Image
                      removeWrapper
                      alt={card.title}
                      className="z-0 w-full h-full object-cover"
                      src={card.imageSrc}
                    />
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-end">
                      <div className="flex flex-grow gap-2 items-center justify-between">
                        <p className="text-tiny text-white/60">{card.description}</p>
                        <Button
                          endContent={
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
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          }
                          radius="full"
                          size="md"
                          onClick={() => router.push(card.route)}
                        >
                          Run
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        {!isMobile && (
          <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4">
            <button
              aria-label="Scroll left"
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              onClick={() => {
                document.getElementById('carousel').scrollLeft -= 300;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              aria-label="Scroll right"
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              onClick={() => {
                document.getElementById('carousel').scrollLeft += 300;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        </div>
      </div>
      <style jsx>
        {`
          .hide-scroll-bar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scroll-bar::-webkit-scrollbar {
            display: none;
          }
        
        
        `}
      </style>
    </>
  );
}
