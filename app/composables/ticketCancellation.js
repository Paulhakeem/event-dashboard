export default function useTicketCancellation() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const cancellationLoading = ref(false);
  const cancelTicket = async (ticketId) => {
    if (
      !confirm(
        "Are you sure you want to cancel this ticket? This action cannot be undone.",
      )
    )
      return;

    cancellationLoading.value = true;
    try {
      const response = await $fetch("/api/tickets/cancel-ticket", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: { ticketId },
      });
      if (response) {
        alert(
          "Your ticket has been cancelled. Check your email for confirmation.",
        );
        return true;
      } else {
        throw new Error(response.message || "Failed to cancel ticket");
      }
    } catch (err) {
      console.error("CANCEL ERROR:", err);
      throw new Error(err.message || "Failed to cancel ticket");
    } finally {
      cancellationLoading.value = false;
    }
  };
  return {
    loading: cancellationLoading,
    cancellationLoading,
    cancelTicket,
  };
}
