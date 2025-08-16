export const useAuthMethods = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.BASE_API_URL;

  async function forgotUsername(email: string) {
    const url = `${baseUrl}/api/account/forgot-username`;

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
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Failed to send the email reminder.";
      throw new Error(errorMessage);
    }
  }

  async function forgotPassword(email: string) {
    const url = `${baseUrl}/api/account/forgot-password`;

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
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Failed to send the email reminder.";
      throw new Error(errorMessage);
    }
  }

  return { forgotUsername, forgotPassword };
};
