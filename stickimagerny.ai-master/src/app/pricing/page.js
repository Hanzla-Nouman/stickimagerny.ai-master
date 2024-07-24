"use client"
import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Navbar from '@/components/navbar'
import useSession from "@/lib/supabase/use-session";
import axios from "axios";
import { Button } from '@nextui-org/react'


const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]
const tiers = [
  {
    name: 'Free',
    id: 'free',
    href: '#',
    price: { monthly: 'Free', annually: '' },
    description: 'Generate up to 12 images',
    features: ['12 credits',],
    mostPopular: false,
  },
  {
    name: 'Essential',
    id: 'essential',
    href: '#',
    price: { monthly: '$14', annually: '' },
    description: 'The Essential plan, perfect for your AI image generation tasks.',
    features: [
      'Up to 5000 images monthly',
      'Priority access to upcoming features',
    ],
    mostPopular: true,
  },
  {
    name: 'Pro',
    id: 'pro',
    href: '#',
    price: { monthly: '$35', annually: '' },
    description: 'Dedicated support and unlimited generation',
    features: [
      'Unlimited generations',
      'Priority access to upcoming features',
    ],
    mostPopular: false,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0])
  const user = useSession()?.user;




  const buyEssential = () => {
    console.log("Affiliate ID:",LemonSqueezy.Affiliate.GetId())
    const windowReference = window.open();
    
    axios.post("/api/purchaseProduct", {
      productId: "286315",
      userId: user.id
    })
    .then(response => {
      console.log(response.data);
      let url = LemonSqueezy.Url.Build(response.data.checkoutUrl)
      console.log(url)
      //windowReference.location = response.data.checkoutUrl;
      windowReference.location = url;
    })
    .catch(error => {
      console.error(error);
      alert("Failed to buy Stock Imagery Essential");
    });
  };

  const buyPro = () => {
    const windowReference = window.open();
    axios.post("/api/purchaseProduct", {
      productId: "294933",
      userId: user.id
    })
    .then(response => {
      console.log(response.data);
      let url = LemonSqueezy.Url.Build(response.data.checkoutUrl)
      //windowReference.location = response.data.checkoutUrl;
      windowReference.location = url;
    })
    .catch(error => {
      console.error(error);
      alert("Failed to buy Stock Imagery Pro");
    });
  };

  return (
    <>
    <Navbar/>
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the &nbsp;best&nbsp;plan for you
          </p>
        </div>
    
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-2 ring-violet-600' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-violet-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-violet-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-violet-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">{frequency.priceSuffix}</span>
              </p>
              <Button
              fullWidth
              onClick={() => {
                if (!user) {
                  window.location.href = "/login";
                } else {
                  if (tier.id === "free") {
                    return;
                  } else if (tier.id === "essential") {
                    buyEssential();
                  } else if (tier.id === "pro") {
                    buyPro();
                  }
                }
              }}
              
                aria-describedby={tier.id}

                className={classNames(
                  tier.mostPopular
                    ? 'bg-violet-600 text-white shadow-sm hover:bg-violet-500'
                    : 'text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300',
                  'mt-6 block  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'
                )}
              >
                {user ? "Buy Plan" : "Create Account"}
              </Button>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-violet-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
    
</>
  )
}
