"use client";

import RegisterStorePage from "@/components/ui/regstore";
import { useSession } from "next-auth/react";

export default function Register() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-muted-foreground">
          Loading session...
        </p>
      </div>
    );
  }

  return <RegisterStorePage />;
}
