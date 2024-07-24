"use client";
import useSession from "@/lib/supabase/use-session";
import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";
import { useSearchParams } from "next/navigation";
import { login, signup } from "@/app/auth/actions";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Login() {
  const session = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const reqUrl = searchParams.get("x-url");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [response, setResponse] = useState();
  const [selected, setSelected] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const loginResponse = await login(formData, reqUrl);
    if (loginResponse) {
      setResponse(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const url = reqUrl?.includes("/generate") ? "/generate" : "/";

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullname", fullname);
    const signUpResponse = await signup(formData, url);
    setResponse(signUpResponse);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 bg-gray-200 h-1/2 md:h-full relative">
          <Image src="/loginImage.webp" layout="fill" objectFit="cover" className="absolute inset-0"/>
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col justify-center items-center">
          <h1 className="text-4xl text-gray-900 font-semibold mb-48">
            stockimagery<span className="text-red-500">.</span>ai
          </h1>
          
          <div className="relative flex justify-center items-center">
            <svg width="400" height="400" className="absolute">
              <defs>
                <radialGradient id="sunrays" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="40%" style={{stopColor:"#FF0", stopOpacity:1}}/>
                  <stop offset="100%" style={{stopColor:"#FF0", stopOpacity:0}}/>
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="180" fill="url(#sunrays)" />
            </svg>
            {user ? <LogoutButton/> : <LoginButton nextUrl={reqUrl}/>}
          </div>
        </div>
      </div>
    </>
  );
}

// <Card className="max-w-full w-[340px] h-[450px]">
//             <CardBody className="overflow-hidden">
//               <Tabs
//                 fullWidth
//                 size="md"
//                 aria-label="Tabs form"
//                 selectedKey={selected}
//                 onSelectionChange={setSelected}
//               >
//                 <Tab key="login" title="Login">
//                   <form className="flex flex-col gap-4">
//                     <Input
//                       isRequired
//                       size={"md"}
//                       id="email"
//                       name="email"
//                       type="email"
//                       label="Email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="mb-4"
//                     />
//                     <Input
//                     isRequired
//                          size={"md"}
//                          id="password"
//                          name="password"
//                          type="password"
//                          label="Password"
//                          value={password}
//                          onChange={(e) => setPassword(e.target.value)}
//                          className="mb-4"
//                     />
//                     <p className="text-center text-small">
//                       Need to create an account?{" "}
//                       <Link size="sm" onPress={() => setSelected("sign-up")}>
//                         Sign up
//                       </Link>
//                     </p>
//                     <div className="flex gap-2 justify-end">
//                       <Button onClick={handleLogin} fullWidth color="primary">
//                         Login
//                       </Button>
//                     </div>
//                   </form>
//                 </Tab>
//                 <Tab key="sign-up" title="Sign up">
//                   <form className="flex flex-col gap-4 ">
//                     <Input
//                       isRequired
//                       size={"md"}
//                       id="fullname"
//                       name="fullname"
//                       type="fullname"
//                       label="Full Name"
//                       value={fullname}
//                       onChange={(e) => setFullname(e.target.value)}
//                       className="mb-4"
//                     />
//                     <Input
//                     isRequired
//                         size={"md"}
//                         id="email"
//                         name="email"
//                         type="email"
//                         label="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="mb-4"
//                     />
//                     <Input
//                     isRequired
//                         size={"md"}
//                         id="password"
//                         name="password"
//                         type="password"
//                         label="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="mb-4"
//                     />
//                     <p className="text-center text-small">
//                       Already have an account?{" "}
//                       <Link size="sm" onPress={() => setSelected("login")}>
//                         Login
//                       </Link>
//                     </p>
//                     <div className="flex gap-2 justify-end">
//                       <Button onClick={handleSignup} fullWidth color="primary">
//                         Sign up
//                       </Button>
//                     </div>
//                   </form>
//                 </Tab>
//               </Tabs>
//               {response && <div>{response.message}</div>}
//             </CardBody>
//           </Card>
