"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white uppercase">
            Joshua·Priest
          </h1>
          <p className="text-sm text-white/50 mt-2">Dashboard Login</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-maroon hover:bg-maroon-light",
              card: "rounded-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
