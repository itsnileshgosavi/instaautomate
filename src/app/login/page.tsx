"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-purple-200">
      <div className="p-8 rounded-xl bg-white shadow-2xl flex flex-col items-center">
        <h1 className="mb-6 font-bold text-3xl text-indigo-600">Insta-Automate</h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-3 text-lg font-semibold shadow-md transition-colors duration-200"
          onClick={() => signIn("instagram")}
        >
          Sign in with Instagram
        </Button>
      </div>
    </div>
  );
}
