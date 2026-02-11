"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed right-5 top-5 gap-2 border-2 cursor-pointer"
        onClick={() => {
          signOut({ callbackUrl: "/login" });
        }}
      >
        Log Out
      </Button>
      {children}
    </>
  );
}
