"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-purple-200">
      <div className="p-8 rounded-xl bg-white shadow-2xl flex flex-col items-center">
        <h1 className="mb-6 font-semibold text-3xl text-black">
          Welcome to Instagram Automations
        </h1>
        <Button
          className="flex items-center gap-2 bg-blue-50 border-2 border-blue-500 cursor-pointer hover:bg-white/80 text-black rounded-lg px-8 py-3 text-lg font-semibold shadow-md transition-colors duration-200"
          onClick={() => signIn("instagram")}
        >
          Sign in with{" "}
          <Image
            src="/insta.svg"
            alt="Instagram icon"
            className="h-20 w-fit"
            width={100}
            height={100}
          />
        </Button>
      </div>
    </div>
  );
}
