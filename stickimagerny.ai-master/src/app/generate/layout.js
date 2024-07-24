"use client"
import { Suspense } from "react";


export default function GenerateLayout(props) {
  const { children, params } = props;

  return (
    <Suspense>
      
      {children}
    </Suspense>
  );
}
