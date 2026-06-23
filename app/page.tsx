"use client";

import dynamic from "next/dynamic";

const Marketplace = dynamic(() => import("@/components/Marketplace").then(mod => mod.Marketplace), {
  ssr: false,
});

export default function Home() {
  return <Marketplace />;
}
