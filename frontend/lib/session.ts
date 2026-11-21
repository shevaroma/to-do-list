let signingOut = false;

/** Clears the session cookie and sends the user to the sign-in page. */
export const endSession = async () => {
  if (signingOut) return;
  signingOut = true;
  await fetch("/api/auth/sign-out", { method: "POST" }).catch(() => undefined);
  window.location.assign("/sign-in");
};
