let signingOut = false;

export const endSession = async () => {
  if (signingOut) return;
  signingOut = true;
  await fetch("/api/auth/sign-out", { method: "POST" }).catch(() => undefined);
  window.location.assign("/sign-in");
};
