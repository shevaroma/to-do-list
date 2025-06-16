"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Trash2, User } from "lucide-react";
import { useUserContext } from "@/app/contexts/user-context";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AccountDeleteDialog from "@/app/(main)/account-delete-dialog";
import { useRouter } from "next/navigation";
import Header from "@/app/(main)/header";

const Settings = () => {
  const router = useRouter();
  const {
    user,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
    deleteUser,
  } = useUserContext();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.display_name) setDisplayName(user.display_name);
    if (user?.email) {
      setEmail(user.email);
      setNewEmail("");
    }
  }, [user]);

  const isDisplayNameUnchanged =
    displayName.trim() === "" || displayName === user?.display_name;
  const isEmailUnchanged = newEmail.trim() === "" || newEmail === email;

  const handleUpdateDisplayName = async () => {
    if (isDisplayNameUnchanged) return;
    await updateUserName({ display_name: displayName });
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || newEmail === email) return;
    await updateUserEmail({ email: newEmail });
    toast.success("Email updated successfully.");
    setEmail("");
  };

  const handleUpdatePassword = async () => {
    if (!currPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await updateUserPassword({
        current_password: currPassword,
        password: newPassword,
      });

      toast.success("Password updated successfully.");
      setCurrPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Current password doesn't match.");
    }
  };

  const handleAccountDelete = async () => {
    if (!user?.id) return;
    try {
      await deleteUser(String(user.id));
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success("Account deleted successfully.");
      router.push("/sign-up");
    } catch {
      toast.error("Failed to delete account.");
    }
  };

  return (
    <div className="w-full">
      <Header title="Settings" />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-1">
                  <User className="h-5 w-5" />
                  Display name
                </CardTitle>
                <CardDescription>
                  Enter your full name or a display name you&#39;d like to use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="display-name"
                    className="w-1/2"
                    placeholder="Enter your display name"
                    value={displayName}
                    maxLength={32}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-4">
                  <CardDescription>
                    Maximum allowed length is 32 characters.
                  </CardDescription>
                  <Button
                    disabled={isDisplayNameUnchanged}
                    onClick={handleUpdateDisplayName}
                  >
                    Update name
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-1">
                  <Mail className="h-5 w-5" />
                  Email address
                </CardTitle>
                <CardDescription>
                  Change your email address here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleUpdateEmail();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="current-email">Current Email</Label>
                    <Input
                      id="current-email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-muted w-1/2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">New Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="Enter your new email address"
                      value={newEmail}
                      className="w-1/2"
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-4">
                    <CardDescription>
                      Make sure to use a valid one.
                    </CardDescription>
                    <Button disabled={isEmailUnchanged} type="submit">
                      Update email
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-1">
                  <Lock className="h-5 w-5" />
                  Password
                </CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleUpdatePassword();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                      className="w-1/2"
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      className="w-1/2"
                      value={newPassword}
                      pattern="^.{8,}$"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                      className="w-1/2"
                      value={confirmPassword}
                      pattern="^.{8,}$"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-4">
                    <CardDescription>
                      Make sure to use a strong password.
                    </CardDescription>
                    <Button
                      disabled={
                        !currPassword || !newPassword || !confirmPassword
                      }
                      type="submit"
                    >
                      Change password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-1">
                  <Trash2 className="h-5 w-5" />
                  Delete account
                </CardTitle>
                <CardDescription>
                  This will permanently delete your Personal Account. Please
                  note that this action is irreversible, so proceed with
                  caution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator />
                <div className="flex justify-between items-center pt-4">
                  <CardDescription className="text-destructive">
                    This action cannot be undone!
                  </CardDescription>
                  <AccountDeleteDialog onDelete={handleAccountDelete} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
