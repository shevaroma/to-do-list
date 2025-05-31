"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Passwords don’t match.");
      return;
    }
    try {
      const response = await fetch(`/api/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });
      if (!response.ok) {
        toast.error(
          response.status === 400
            ? "Email already in use."
            : "Something went wrong.",
        );
        return;
      }
      router.push("/");
    } catch {
      toast.error("No connection.");
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={signUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      pattern="^(?!\s*$).+"
                      title="Can’t be empty."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      pattern="^.{8,}$"
                      title="At least 8 characters."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="passwordConfirmation">
                      Confirm password
                    </Label>
                    <Input
                      id="passwordConfirmation"
                      type="password"
                      required
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      pattern="^.{8,}$"
                      title="At least 8 characters."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign up
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign in.
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
