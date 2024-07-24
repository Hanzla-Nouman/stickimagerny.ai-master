import { useState, useMemo, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  cn,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

const StockStyles = [
  { label: "Cinematic", name: "Fooocus Cinematic", src: "/cinematic.png" },
  { label: "Macro Photography", name: "Macro Photography", src: "/macro-photography.png" },
  { label: "Corporate Ads", name: "Ads Corporate", src: "/ad-corporate.png" },
  { label: "Retail Ads", name: "Ads Retail", src: "/ad-retail.png" },
  { label: "Real Estate Ads", name: "Ads Real Estate", src: "/ads-realestate.png" },
  {
    label: "Gourmet Food Photography", name: "Ads Gourmet Food Photography",
    src: "https://chatx.ai/wp-content/uploads/2023/03/a_burger_Cinematic_Editorial_Photography_Photography__89d6654a-504c-4287-8e24-cf6f6-1024x1024.jpg.webp",
  },
 
  { label: "Sketch Drawing", name: "Sketchup", src: "/sketchup.png" },



  { label: "Polaroid", name: "Faded Polaroid Photo", src: "/polaroid.png" },
  { label: "Minimalist", name: "Misc Minimalist", src: "/Minimalist.png" },
 
  { label: "Futuristic", name: "Futuristic Futuristic", src: "/futuristic.png" },
];

const ArtStyles = [
  { label: "Vector Art", name: "Simple Vector Art", src: "/simple-vector-art.png" },

  { label: "Watercolor", name: "Watercolor 2", src: "/watercolor.png" },
  { label: "Sticker Designs", name: "Sticker Designs", src: "/sticker-designs.png" },
  { label: "Dreamscape", name: "Misc Dreamscape", src: "/dreamscape.png" },

  {
    label: "Pop Art", name: "Pop Art 2",
    src: "/pop-art.png",
  },
  { label:"Adorable 3D Character",name: "Adorable 3D Character", src: "/3D Character.png" },

  { label: "Pencil Drawing", name: "Pencil Sketch Drawing", src: "/pencil-sketch.png" },
  { label: "Anime", name: "SAI Anime", src: "/anime.png" },
  { label: "Impressionism", name: "Impressionism", src: "/impressionism.png" },
  { label: "Origami Art", name: "SAI Origami", src: "/origami.png" },
];

const LogoStyles = [ { label: "Logo Design", name: "Logo Design", src: "/logo-design.png" },
{ label: "Infographic", name: "Infographic Drawing", src: "/infographic-drawing.png" },

]

export default function DropdownNextUI(props) {
  const [isOpen, setIsOpen] = useState(false);
  // const styleList = useMemo(() => ({
  //   "Stock": StockStyles,
  //   "Art": ArtStyles,
  //   "Logo": LogoStyles
  // }), []);
  //const [selectedKeys, setSelectedKeys] = useState("Choose Style");
  const [styleList, setStyleList] = useState({"Stock": StockStyles, "Art": ArtStyles, "Logo": LogoStyles})

  const [selectedKeys, setSelectedKeys] = useState(styleList[props.imageType][0].label);

  const [dummyImageType, setDummyImageType] = useState()

  useEffect(() => {
    const firstStyle = styleList[props.imageType][0];
    console.log(firstStyle.name)
    setSelectedKeys(firstStyle.label);
    props.setStyle(firstStyle.name);
  }, [props.imageType, props.setStyle, styleList])

  return (
    <Popover
      placement="bottom"
      showArrow
      offset={10}
      isOpen={isOpen}
      backdrop="blur"
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button size="sm" className="w-full"color="default"  variant="flat"  endContent={ <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z" fill="currentColor"/>
                  </svg>}>{selectedKeys}</Button>
      </PopoverTrigger>
      <PopoverContent className="">
        <div className=" gap-2 grid grid-cols-2 sm:grid-cols-5 ">
          {styleList[props.imageType].map((style, index) => {
            return (
              <Card
                shadow="sm"
                key={index}
                isPressable
                onPress={() => {
                  props.setStyle(style.name);
                  setSelectedKeys(style.label)
                  setIsOpen(false);
                }}
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={style.name}
                    className="w-full object-cover h-[140px]"
                    src={style.src}
                  />
                </CardBody>
                <CardFooter className="text-small justify-between">
                  <b>{style.label}</b>
                  {/* <p className="text-default-500">{item.price}</p> */}
                </CardFooter>
              </Card>
              //   <Card
              //     isFooterBlurred
              //     radius="lg"
              //     className="border-none h-full"
              //     isPressable
              //     onPress={() => {
              //       setSelectedKeys(style.name);
              //       setIsOpen(false);
              //     }}
              //   >
              //     <Image
              //       alt={style.name}
              //       className=" object-fill"
              //       height={200}
              //       width={200}
              //       src={style.src}
              //       //src="https://image.lexica.art/full_webp/b8f073a4-823e-46f7-bda1-d1b656454832"
              //     />
              //     <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1  shadow-small ml-1 z-10">
              //       <p className="text-tiny text-white">{style.name}</p>
              //       {/* <Button
              //   className="text-tiny text-white bg-black/20"
              //   variant="flat"
              //   color="default"
              //   radius="lg"
              //   size="sm"
              // >
              //   Notify me
              // </Button> */}
              //     </CardFooter>
              //   </Card>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
