export const POST = async (request: Request) => {
  const { token, newPassword, newPasswordConfirmation } = await request.json();
  return fetch(`${process.env.API_BASE_URL}/auth/reset-confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword,
      confirm_password: newPasswordConfirmation,
    }),
  });
};
