"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const ResetPasswordPage = () => {
  const token = useSearchParams().get("token");
  if (!token) notFound();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirmation) {
      toast.error("Passwords don’t match.");
      return;
    }
    try {
      const response = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      toast.success("Password reset.");
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
              <CardTitle className="text-2xl">Reset password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={resetPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      pattern="^.{8,}$"
                      title="At least 8 characters."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPasswordConfirmation">
                      Confirm new password
                    </Label>
                    <Input
                      id="newPasswordConfirmation"
                      type="password"
                      required
                      value={newPasswordConfirmation}
                      onChange={(e) =>
                        setNewPasswordConfirmation(e.target.value)
                      }
                      pattern="^.{8,}$"
                      title="At least 8 characters."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Reset password
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Remember your password?{" "}
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

export default ResetPasswordPage;
