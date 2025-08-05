"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();

  console.log(session);
  if (!session?.data?.user) {
    redirect("/login");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <h1>Home</h1>
        <h2>You are signed in as {session?.data?.user?.name}</h2>
      </div>
       
    </div>
  );
}
