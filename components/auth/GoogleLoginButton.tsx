"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  return (
    <Button
      type="button"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl: "/admin" })}
    >
      Continue with Google
    </Button>
  );
}