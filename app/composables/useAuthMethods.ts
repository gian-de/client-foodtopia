export const useAuthMethods = () => {
  const { apiUrl } = useApiBase();

  async function forgotUsername(email: string) {
    const url = apiUrl("/api/account/forgot-username");

    try {
      const data = await $fetch<{ message?: string; Message?: string }>(url, {
        method: "POST",
        body: { email },
      });
      return { success: true, message: data.message || data.Message || "If an account with this email exists, the username has been sent." };
    } catch (err: unknown) {
      throw new Error(apiErrorMessage(err, "Failed to send the email reminder."));
    }
  }

  async function forgotPassword(email: string) {
    const url = apiUrl("/api/account/forgot-password");

    try {
      const data = await $fetch<{ message?: string; Message?: string }>(url, {
        method: "POST",
        body: { email },
      });
      return { success: true, message: data.message || data.Message || "If an account with this email exists, a password reset link has been sent." };
    } catch (err: any) {
      throw new Error(apiErrorMessage(err, "Failed to send the email reminder."));
    }
  }

  return { forgotUsername, forgotPassword };
};
