import React, { useState, useEffect } from "react";

const DynamicTitle = () => {
  const words = [" generate hyper-realistic ", " generate anime ", " upscale "];
  const [activeWord, setActiveWord] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 150;
    const deletingSpeed = 50;
    let typingTimeout;

    if (isDeleting) {
      typingTimeout = setTimeout(() => {
        setActiveWord(words[index].substring(0, activeWord.length - 1));
        if (activeWord.length === 0) {
          setIsDeleting(false);
          setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      typingTimeout = setTimeout(() => {
        setActiveWord(words[index].substring(0, activeWord.length + 1));
        if (activeWord.length === words[index].length) {
          setTimeout(() => setIsDeleting(true), 2000); // Wait for 2 seconds before starting to delete
        }
      }, typingSpeed);
    }

    return () => clearTimeout(typingTimeout);
  }, [activeWord, isDeleting, index]);

  return (
    <>
    <div className="mt-24  mb-4 flex justify-center flex-col items-center ">
     
        <span className="text-4xl font-montas font-semibold text-center tracking-widest text-gray-800">Transform Your Design Process <br/> With AI Technology</span>
     <div className="p-2 bg-white rounded-full mt-10">
      <input type="text" placeholder="Enter Your Text..." className="border-none selection:border-none text-black w-72 " />
      <button className="bg-pink-500 text-back rounded-full px-5 py-2">Get Started</button>
     </div>
      
    </div>
     
        </>
  );
};

export default DynamicTitle;
