"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GitHubLogin from "@/components/ui/github-button";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-87.5">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to help the needy</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GitHubLogin />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="ghost" disabled className="w-full">
            Email & Password (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
