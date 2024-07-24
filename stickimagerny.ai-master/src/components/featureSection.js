import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import {Button} from "@nextui-org/react";
const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

export default function FeatureSection(props) {
  return (
    <div className="overflow- bg-white py-24  sm:py-16 ">
      <div className="mx-auto overflow-hidden max-w-6xl   rounded-br-3xl ">
        <div className="mx-auto overflow-hidde rounded-br-3xl  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
        { props.showDetailsOnRight ? <div className="lg:pr-8 ">
            <div className="lg:max-w-lg">
              {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
              <p className=" text-3xl tracking-tight font-montas font-semibold text-gray-800 sm:text-4xl">{props.mainTitle}</p>
              <p className="mt-3 text-lg tracking-tight font-normal  leading-8 text-gray-900">
               {props.description}
              </p>
            <div >
              <div onPress={() => window.location.href = props.link} className='flex mt-6 font-semibold items-center justify-center  text-pink-500 border border-y-gray-900 border-x-gray-900  rounded-full px-6 py-2 w-fit'>
                Try Now
              </div>
              
              {/* <Button
                type="button"
                color="secondary"
                variant="shadow"
                onPress={() => window.location.href = props.link}
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
                className="mt-8 mb-8 rounded-md pl-4 pr-2 py-1"
              >
                <div className="flex flex-row items-center w-full">
                  <div className="text-lg">Try Now</div>
                </div>
              </Button> */}
            </div>
            </div>
          </div> :   <div className="max-h-[32rem] z-10 pl-9  pt-9 from-pink-300 rounded-br-3xl  via-pink-200 to-pink-400 bg-gradient-to-tr rounded-3xl sm:max-h-[22rem] mx-0 bg-pink-400  ">
          
          <img
            src={props.src}
            alt="Product screenshot"
            className=" w-[16rem] object-fill h-full max-w-none rounded-3xl rounded-br-3xl rounded-tr-none shadow-xl ring-1 ring-gray-400/10 sm:w-[32rem] md:-ml-4 lg:-ml-0"
          />
        
        </div>}
        { !props.showDetailsOnRight ? <div className="lg:pr-8 ">
            <div className="lg:max-w-lg">
              {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
              <p className=" text-3xl tracking-tight font-montas font-semibold text-gray-800 sm:text-4xl">{props.mainTitle}</p>
              <p className="mt-3 text-lg tracking-tight font-normal  leading-8 text-gray-900">
               {props.description}
              </p>
            <div >
              <div onPress={() => window.location.href = props.link} className='flex mt-6 font-semibold items-center justify-center  text-pink-500 border border-y-gray-900 border-x-gray-900  rounded-full px-6 py-2 w-fit'>
                Try Now
              </div>
              
              {/* <Button
                type="button"
                color="secondary"
                variant="shadow"
                onPress={() => window.location.href = props.link}
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
                className="mt-8 mb-8 rounded-md pl-4 pr-2 py-1"
              >
                <div className="flex flex-row items-center w-full">
                  <div className="text-lg">Try Now</div>
                </div>
              </Button> */}
            </div>
            </div>
          </div> :   <div className="max-h-[32rem] z-10 pl-9  pt-9 from-pink-300 rounded-br-3xl  via-pink-200 to-pink-400 bg-gradient-to-tr rounded-3xl sm:max-h-[22rem] mx-0 bg-pink-400  ">
          
          <img
            src={props.src}
            alt="Product screenshot"
            className=" w-[16rem] object-fill h-full max-w-none rounded-3xl rounded-br-3xl rounded-tr-none shadow-xl ring-1 ring-gray-400/10 sm:w-[32rem] md:-ml-4 lg:-ml-0"
          />
        
        </div>}
          {/* <div className="max-h-[32rem] border-2  sm:max-h-[32rem] mx-auto bg-pink-400  ">
            <img
              src={props.src}
              alt="Product screenshot"
              className=" overflow-hidden mt-6  w-[16rem] max-w-none  top-4 rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[32rem] md:-ml-4 lg:-ml-0"
            />
          </div> */}
          
         
        </div>
      </div>
    </div>
  )
}
