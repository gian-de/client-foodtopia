export const useAuthMethods = () => {
  const { apiUrl } = useApiBase();

  async function forgotUsername(email: string) {
    const url = apiUrl("/api/account/forgot-username");

    try {
      const data = await $fetch<{ message: string }>(url, {
        method: "POST",
        body: { email },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, message: data.message };
    } catch (err: any) {
      throw new Error(apiErrorMessage(err, "Failed to send the email reminder."));
    }
  }

  async function forgotPassword(email: string) {
    const url = apiUrl("/api/account/forgot-password");

    try {
      const data = await $fetch<{ message: string }>(url, {
        method: "POST",
        body: { email },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, message: data.message };
    } catch (err: any) {
      throw new Error(apiErrorMessage(err, "Failed to send the email reminder."));
    }
  }

  return { forgotUsername, forgotPassword };
};
